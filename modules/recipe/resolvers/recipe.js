// eslint-disable-next-line import/no-extraneous-dependencies
const { UserInputError } = require('apollo-server-errors');
const { Op } = require('sequelize');
const { sequelize } = require('../../../database/models');
const models = require('../../../database/models');
const {
  recipeFormValidation,
} = require('../../../middleware/fields/recipeInputFieldsValidation');
const {
  maxPageSizeValidation,
  setPage,
} = require('../../../middleware/pagination/pageSizeValidation');

let t;
module.exports = {
  Query: {
    recipeList: async (_, { pageSize = 10, page = 0 }, { user }) => {
      maxPageSizeValidation(pageSize);
      const offset = setPage(pageSize, page);

      const userId = user.id;

      try {
        return await models.Recipe.findAll({
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
          order: [['created_at', 'DESC']],
          limit: pageSize,
          offset,
          include: [
            {
              model: models.User,
              as: 'User',
              where: { id: userId },
            },
            {
              model: models.RecipeIngredient,
              as: 'ingredients',
              required: true,
            },
            {
              model: models.RecipeInstruction,
              as: 'instructions',
              required: true,
            },
            {
              model: models.RecipeMedia,
              as: 'image',
              required: true,
            },
          ],
        });
      } catch (err) {
        throw new Error(err);
      }
    },

    recipeDetail: async (_, { id }, { user }) => {
      try {
        const userId = user.id;
        const recipe = await models.Recipe.findByPk(id, {
          include: [
            {
              model: models.User,
              as: 'User',
              where: { id: userId },
            },
            {
              model: models.RecipeIngredient,
              as: 'ingredients',
              required: true,
            },
            {
              model: models.RecipeInstruction,
              as: 'instructions',
              required: true,
            },
            {
              model: models.RecipeMedia,
              as: 'image',
              required: true,
            },
          ],
        });
        if (recipe === null || recipe.deletedAt !== null) {
          throw new Error('Recipe not found');
        }
        return recipe;
      } catch (error) {
        throw new Error(error);
      }
    },

    favoriteRecipeList: async (_, { pageSize = 10, page = 0 }, { user }) => {
      maxPageSizeValidation(pageSize);
      const offset = setPage(pageSize, page);

      const userId = user.id;
      try {
        const recipes = await models.Recipe.findAll({
          where: {
            deletedAt: {
              [Op.is]: null,
            },
            isFavorite: {
              [Op.is]: true,
            },
          },
          limit: pageSize,
          offset,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: models.User,
              as: 'User',
              where: { id: userId },
            },
            {
              model: models.RecipeIngredient,
              as: 'ingredients',
              required: true,
            },
            {
              model: models.RecipeInstruction,
              as: 'instructions',
              required: true,
            },
            {
              model: models.RecipeMedia,
              as: 'image',
              required: true,
            },
          ],
        });
        return recipes;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    recipeCreate: async (_, { input }, { user }) => {
      let recipe = {};
      const userId = user.id;
      const { title, description, ingredients, instructions, image } = input;
      const { error } = await recipeFormValidation(input);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      try {
        t = await sequelize.transaction();
        // create recipe
        recipe = await models.Recipe.create(
          {
            title,
            description,
            userId,
          },
          { transaction: t }
        );
        const recipeId = recipe.id;

        // create ingredients
        const modifyIngredients = ingredients.map((ingredient) => ({
          ingredient,
          recipeId,
        }));
        await models.RecipeIngredient.bulkCreate(modifyIngredients, {
          transaction: t,
          returning: true,
        });

        // create instructions
        const modifyInstructions = instructions.map((instruction) => ({
          instruction,
          recipeId,
        }));
        await models.RecipeInstruction.bulkCreate(modifyInstructions, {
          transaction: t,
          returning: true,
        });

        // create recipe image
        await models.RecipeMedia.create(
          {
            url: image,
            recipeId,
          },
          { transaction: t }
        );

        await t.commit();

        return await models.Recipe.findByPk(recipeId, {
          include: [
            {
              model: models.User,
              as: 'User',
              where: { id: userId },
            },
            {
              model: models.RecipeIngredient,
              as: 'ingredients',
              required: true,
            },
            {
              model: models.RecipeInstruction,
              as: 'instructions',
              require: true,
            },
            {
              model: models.RecipeMedia,
              as: 'image',
              require: true,
            },
          ],
        });
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error('Failed Create Recipe: ', err);
      }
    },

    recipeUpdate: async (_, { id, input }, { user }) => {
      const userId = user.id;
      const { title, description, ingredients, instructions, image } = input;
      const { error } = await recipeFormValidation(input);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      const recipe = await models.Recipe.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'User',
            where: { id: userId },
          },
          {
            model: models.RecipeIngredient,
            as: 'ingredients',
            required: true,
          },
          {
            model: models.RecipeInstruction,
            as: 'instructions',
            required: true,
          },
          {
            model: models.RecipeMedia,
            as: 'image',
            required: true,
          },
        ],
      });

      if (recipe == null || recipe.deletedAt !== null) {
        throw new Error('Recipe not found');
      }

      const recipeId = recipe.id;
      const modifyIngredients = ingredients.map((ingredient) => ({
        ingredient,
        recipeId,
      }));
      const modifyInstructions = instructions.map((instruction) => ({
        instruction,
        recipeId,
      }));

      try {
        t = await sequelize.transaction();
        /// update recipe
        await recipe.update(
          { title, description, userId },
          {
            where: {
              id,
            },
            transaction: t,
          }
        );

        // create ingredients

        await models.RecipeIngredient.bulkCreate(modifyIngredients, {
          transaction: t,
          updateOnDuplicate: ['ingredient'],
        });

        /// update intructions
        await models.RecipeInstruction.bulkCreate(modifyInstructions, {
          updateOnDuplicate: ['instruction'],
          transaction: t,
        });

        /// update image
        await models.RecipeMedia.update(
          {
            url: image,
          },
          { where: { id: recipe.image.id }, transaction: t }
        );

        await t.commit();

        return await models.Recipe.findByPk(id, {
          include: [
            {
              model: models.User,
              as: 'User',
              where: { id: userId },
            },
            {
              model: models.RecipeIngredient,
              as: 'ingredients',
              required: true,
            },
            {
              model: models.RecipeInstruction,
              as: 'instructions',
              required: true,
            },
            {
              model: models.RecipeMedia,
              as: 'image',
              required: true,
            },
          ],
        });
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error(err);
      }
    },

    recipeDelete: async (_, { id }, { user }) => {
      const userId = user.id;

      const recipe = await models.Recipe.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'User',
            where: { id: userId },
          },
          {
            model: models.RecipeIngredient,
            as: 'ingredients',
            required: true,
          },
          {
            model: models.RecipeInstruction,
            as: 'instructions',
            required: true,
          },
          {
            model: models.RecipeMedia,
            as: 'image',
            required: true,
          },
        ],
      });

      if (recipe === null || recipe.deletedAt !== null) {
        throw new Error('Recipe Not Found');
      }

      try {
        await recipe.update(
          { deletedAt: Date.now() },
          { returning: true, plain: true }
        );
        return recipe;
      } catch (err) {
        throw new Error('Failed delete recipe: ', err);
      }
    },
    addFavoriteRecipe: async (_, { id }, { user }) => {
      const userId = user.id;

      const recipe = await models.Recipe.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'User',
            where: { id: userId },
          },
          {
            model: models.RecipeIngredient,
            as: 'ingredients',
            required: true,
          },
          {
            model: models.RecipeInstruction,
            as: 'instructions',
            required: true,
          },
          {
            model: models.RecipeMedia,
            as: 'image',
            required: true,
          },
        ],
      });

      if (recipe === null || recipe.deletedAt !== null) {
        throw new Error('Recipe Not Found');
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
