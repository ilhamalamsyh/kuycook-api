const {
  User,
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
  RecipeMedia,
  sequelize,
} = require("../../../database/models");

const { Op } = require("sequelize");
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const {
  maxPageSizeValidation,
  setPage,
} = require("../../../shared/pageSizeValidation");

let t;
module.exports = {
  Query: {
    recipeList: async (_, { pageSize = 10, page }, { user }) => {
      maxPageSizeValidation(pageSize);
      const offset = setPage(pageSize, page);
      try {
        const userId = user.id;
        const resep = await Recipe.findAll({
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
          limit: pageSize,
          offset: offset,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: User,
              as: "User",
              where: { id: userId },
            },
            {
              model: RecipeIngredient,
              as: "ingredients",
              required: true,
            },
            {
              model: RecipeInstruction,
              as: "instructions",
              required: true,
            },
            {
              model: RecipeMedia,
              as: "image",
              required: true,
            },
          ],
        });
        return resep;
      } catch (error) {
        throw new Error(error);
      }
    },

    recipeDetail: async (_, { id }, { user }) => {
      try {
        userId = user.id;
        const resepDetail = await Recipe.findByPk(id, {
          include: [
            {
              model: User,
              as: "User",
              where: { id: userId },
            },
            {
              model: RecipeIngredient,
              as: "ingredients",
              required: true,
            },
            {
              model: RecipeInstruction,
              as: "instructions",
              required: true,
            },
            {
              model: RecipeMedia,
              as: "image",
              required: true,
            },
          ],
        });
        if (resepDetail === null || resepDetail.deletedAt !== null) {
          throw new Error("Recipe not found");
        }
        return resepDetail;
      } catch (error) {
        throw new Error(error);
      }
    },

    favoriteRecipeList: async (_, { pageSize = 10, page = 0 }, { user }) => {
      maxPageSizeValidation(pageSize);
      const offset = setPage(pageSize, page);
      try {
        const userId = user.id;
        const resep = await Recipe.findAll({
          where: {
            deletedAt: {
              [Op.is]: null,
            },
            isFavorite: {
              [Op.is]: true,
            },
          },
          limit: pageSize,
          offset: offset,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: User,
              as: "User",
              where: { id: userId },
            },
            {
              model: RecipeIngredient,
              as: "ingredients",
              required: true,
            },
            {
              model: RecipeInstruction,
              as: "instructions",
              required: true,
            },
            {
              model: RecipeMedia,
              as: "image",
              required: true,
            },
          ],
        });
        return resep;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    recipeCreate: async (root, args, { user }) => {
      t = await sequelize.transaction();
      const userId = user.id;
      let { title, description, ingredients, instructions, image } = args.input;
      let recipe = null;

      try {
        // create recipe
        recipe = await Recipe.create(
          {
            title,
            description,
            userId,
          },
          { transaction: t }
        );
        const recipeId = recipe.id;

        // create ingredients
        const modifyIngredients = ingredients.map(ingredient => {
          return { ingredient, recipeId };
        });
        await RecipeIngredient.bulkCreate(modifyIngredients, {
          transaction: t,
          returning: true,
        });

        // create instructions
        const modifyInstructions = instructions.map(instruction => {
          return { instruction, recipeId };
        });
        await RecipeInstruction.bulkCreate(modifyInstructions, {
          transaction: t,
          returning: true,
        });

        // create recipe image
        await RecipeMedia.create(
          {
            url: image,
            recipeId,
          },
          { transaction: t }
        );

        await t.commit();

        return await Recipe.findByPk(recipeId, {
          include: [
            {
              model: User,
              as: "User",
              where: { id: userId },
            },
            {
              model: RecipeIngredient,
              as: "ingredients",
              required: true,
            },
            {
              model: RecipeInstruction,
              as: "instructions",
              require: true,
            },
            {
              model: RecipeMedia,
              as: "image",
              require: true,
            },
          ],
        });
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error("Failed Create Recipe: ", err);
      }
    },
    recipeUpdate: async (root, { id, input }, { user }) => {
      t = await sequelize.transaction();
      const userId = user.id;

      const { title, description, ingredients, instructions, image } = input;
      const recipe = await Recipe.findByPk(id, {
        include: [
          {
            model: User,
            as: "User",
            where: { id: userId },
          },
          {
            model: RecipeIngredient,
            as: "ingredients",
            required: true,
          },
          {
            model: RecipeInstruction,
            as: "instructions",
            required: true,
          },
          {
            model: RecipeMedia,
            as: "image",
            required: true,
          },
        ],
      });

      if (!recipe || recipe.deletedAt !== null) {
        throw new Error("Recipe not found");
      }

      const modifyIngredients = ingredients.map(ingredient => {
        return { ingredient, id };
      });

      const modifyInstructions = instructions.map(instruction => {
        return { instruction, id };
      });

      try {
        /// update recipe
        await recipe.update(
          { title, description, userId },
          {
            where: {
              id: id,
            },
            transaction: t,
          }
        );
        /// update ingredients
        await RecipeIngredient.bulkCreate(modifyIngredients, {
          updateOnDuplicate: ["ingredient"],
          transaction: t,
        });
        /// update intructions
        await RecipeInstruction.bulkCreate(modifyInstructions, {
          updateOnDuplicate: ["instruction"],
          ignoreDuplicates: true,
          transaction: t,
        });
        /// update image
        await RecipeMedia.update(
          {
            url: image,
          },
          { where: { id: recipe.image.id }, transaction: t }
        );
        await t.commit();

        return recipe;
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error("failed to updated recipe: ", err);
      }
    },
    recipeDelete: async (root, { id }, { user }) => {
      const userId = user.id;

      const recipe = await Recipe.findByPk(id, {
        include: [
          {
            model: User,
            as: "User",
            where: { id: userId },
          },
          {
            model: RecipeIngredient,
            as: "ingredients",
            required: true,
          },
          {
            model: RecipeInstruction,
            as: "instructions",
            required: true,
          },
          {
            model: RecipeMedia,
            as: "image",
            required: true,
          },
        ],
      });

      if (recipe === null || recipe.deletedAt !== null) {
        throw new Error("Recipe Not Found");
      }

      try {
        await recipe.update(
          { deletedAt: Date.now() },
          { returning: true, plain: true }
        );
        return recipe;
      } catch (err) {
        throw new Error("Failed delete recipe: ", err);
      }
    },
    addFavoriteRecipe: async (_, { id }, { user }) => {
      const userId = user.id;

      const recipe = await Recipe.findByPk(id, {
        include: [
          {
            model: User,
            as: "User",
            where: { id: userId },
          },
          {
            model: RecipeIngredient,
            as: "ingredients",
            required: true,
          },
          {
            model: RecipeInstruction,
            as: "instructions",
            required: true,
          },
          {
            model: RecipeMedia,
            as: "image",
            required: true,
          },
        ],
      });

      if (recipe === null || recipe.deletedAt !== null) {
        throw new Error("Recipe Not Found");
      }

      try {
        if (recipe.isFavorite === false) {
          recipe.update({ isFavorite: true });
        } else {
          recipe.update({ isFavorite: false });
        }
        return recipe;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

/// will use it when we have different naming between schema and model

// try {
//     const t = await Recipe.findAll(
//     {
//         logging:console.log,
//         include:[
//         {
//             model: RecipeIngredient,
//             as: 'recipe_ingredient',
//             required: true
//         },
//         {
//             model: RecipeInstruction,
//             as: 'recipe_instruction',
//             required: true
//         }]
//     });

//     console.log(t);

// Mapping
//     return t.map(item => {
//         const newItem = item.get({plain:true});
//         newItem.ingredients = newItem.recipe_ingredient

//         newItem.instructions = newItem.recipe_instruction
//         console.log(newItem);
//         return newItem;
//     });
// } catch (error) {
//     console.log('Error nih: ', error);
// }
