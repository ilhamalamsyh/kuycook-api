/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
// eslint-disable-next-line import/no-extraneous-dependencies
const { UserInputError, ApolloError } = require('apollo-server-errors');
const { Op } = require('sequelize');
const {sequelize} = require('../../../database/models');
const models = require('../../../database/models');
const {
    recipeFormValidation,
    recipeUpdateFormValidation,
} = require('../../../middleware/fields/recipeInputFieldsValidation');
const {
    maxPageSizeValidation,
    setPage,
} = require('../../../middleware/pagination/pageSizeValidation');

let t;
module.exports = {
    Query: {
        recipeList: async (_, {pageSize = 10, page = 0}) => {
            maxPageSizeValidation(pageSize);
            const offset = setPage(pageSize, page);

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
                throw new ApolloError(err);
            }
        },

        myRecipeList: async (_, {pageSize = 10, page = 0}, {user}) => {
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
                            where: {id: userId},
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
                throw new ApolloError(err);
            }
        },

        recipeDetail: async (_, {id}) => {
            try {
                const recipe = await models.Recipe.findByPk(id, {
                    include: [
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
                    throw new UserInputError('Recipe not found');
                }
                return recipe;
            } catch (error) {
                throw new ApolloError(error);
            }
        },

        favoriteRecipeList: async (_, {pageSize = 10, page = 0}, {user}) => {
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
                            where: {id: userId},
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
                throw new ApolloError(error);
            }
        },
    },
    Mutation: {
        recipeCreate: async (_, {input}, {user}) => {
            let recipe = {};
            const userId = user.id;
            const {title, description, ingredients, instructions, image, servings, cookingTime} = input;
            const {error} = await recipeFormValidation(input);
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
                        servings,
                        cookingTime,
                        userId,
                    },
                    {transaction: t}
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
                    {transaction: t}
                );

                await t.commit();

                return await models.Recipe.findByPk(recipeId, {
                    include: [
                        {
                            model: models.User,
                            as: 'User',
                            where: {id: userId},
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
                throw new ApolloError('Failed Create Recipe: ', err);
            }
        },

        recipeUpdate: async (_, {id, input}, {user}) => {
            const userId = user.id;
            const {title, description, ingredients, instructions, image, servings, cookingTime} = input;
            const {error} = await recipeUpdateFormValidation(input);
            if (error) {
                throw new UserInputError(error.details[0].message);
            }

            const recipe = await models.Recipe.findByPk(id, {
                include: [
                    {
                        model: models.RecipeMedia,
                        as: 'image',
                        required: true,
                    },
                ],
            });

            if (recipe == null || recipe.deletedAt !== null) {
                throw new UserInputError('Recipe not found');
            } else if (recipe.userId != userId) {
                throw new UserInputError('Recipe not found for this user id.');
            }

            const recipeId = recipe.id;

            const recipeIngredients = await models.RecipeIngredient.findAll({
                where: {recipeId},
                attributes: ['id', 'recipeId'],
            });

            const recipeInstruction = await models.RecipeInstruction.findAll({
                where: {recipeId},
                attributes: ['id', 'recipeId'],
            });

            let recipeIngredientExistingIds = [];
            let recipeInstructionExistingIds = [];

            for (let i = 0; i < recipeIngredients.length; i++) {
                const recipeIngredientId = recipeIngredients[i].id;
                ingredients.forEach((ingredient) => {
                    const recipeIngredientRecipeId = parseInt(ingredient.recipeId, 10);
                    if (recipeIngredientRecipeId !== recipeId) {
                        throw new UserInputError('Recipe id of recipe ingredient id not found.');
                    }
                    // TODO (Ilham): validate recipe ingredient id not found
                });
                recipeIngredientExistingIds.push(recipeIngredientId);
            }

            for (let i = 0; i < recipeInstruction.length; i++) {
                const recipeInstructionId = recipeInstruction[i].id;
                instructions.forEach((instruction) => {
                    const recipeInstructionRecipeId = parseInt(instruction.recipeId, 10);
                    if (recipeInstructionRecipeId !== recipeId) {
                        throw new UserInputError('Recipe id of recipe instruction id not found.');
                    }
                    // TODO (Ilham): validate recipe instruction id not found
                });
                recipeInstructionExistingIds.push(recipeInstructionId);
            }

            try {
                t = await sequelize.transaction();

                /// update recipe
                await recipe.update(
                    {title, description, servings, cookingTime, userId},
                    {
                        where: {
                            id,
                        },
                        transaction: t,
                    }
                );

                // update or create new recipe ingredients
                await ingredients.forEach(async (ingredient) => {
                    let modifyIngredients;
                    let recipeIngredientId = parseInt(ingredient.id, 10);

                    if (ingredient.id == '' || ingredient.id === null) {
                        modifyIngredients = await models.RecipeIngredient.create(
                            {
                                ingredient: ingredient.ingredient,
                                recipeId: ingredient.recipeId,
                            },
                            {transaction: t}
                        );
                    }

                    if (recipeIngredientExistingIds.includes(recipeIngredientId)) {
                        modifyIngredients = await models.RecipeIngredient.update(
                            {
                                ingredient: ingredient.ingredient,
                                recipeId: ingredient.recipeId,
                            },
                            {where: {id: ingredient.id}, transaction: t}
                        );
                    } else {
                        throw new UserInputError('Recipe Ingredient ID not found.');
                    }

                    return modifyIngredients;
                });

                // Update or Create recipe instructions
                await instructions.forEach(async (instruction) => {
                    let modifyInstructions;
                    let recipeInstructionId = parseInt(instruction.id, 10);

                    if (instruction.id == '' || instruction.id === null) {
                        modifyInstructions = await models.RecipeInstruction.create(
                            {
                                instruction: instruction.instruction,
                                recipeId: instruction.recipeId,
                            },
                            {transaction: t}
                        );
                    }
                    if (recipeInstructionExistingIds.includes(recipeInstructionId)) {
                        modifyInstructions = await models.RecipeInstruction.update(
                            {
                                instruction: instruction.instruction,
                                recipeId: instruction.recipeId,
                            },
                            {
                                where: {id: instruction.id},
                                transaction: t,
                            }
                        );
                    } else {
                        throw new UserInputError('Recipe Instruction ID not found.');
                    }
                    return modifyInstructions;
                });

                /// update image
                await models.RecipeMedia.update(
                    {
                        url: image,
                    },
                    {where: {id: recipe.image.id}, transaction: t}
                );

                await t.commit();
                const recipeUpdate = await models.Recipe.findByPk(id, {
                    include: [
                        {
                            model: models.User,
                            as: 'User',
                            where: {id: userId},
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

                return recipeUpdate;
            } catch (err) {
                if (t) {
                    await t.rollback();
                }
                throw new ApolloError(err);
            }
        },

        recipeDelete: async (_, {id}, {user}) => {
            const userId = user.id;

            const recipe = await models.Recipe.findByPk(id, {
                include: [
                    {
                        model: models.User,
                        as: 'User',
                        where: {id: userId},
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
                throw new UserInputError('Recipe Not Found');
            }

            try {
                await recipe.update(
                    {deletedAt: Date.now()},
                    {returning: true, plain: true}
                );
                return recipe;
            } catch (err) {
                throw new Error('Failed delete recipe: ', err);
            }
        },
        addFavoriteRecipe: async (_, {id}, {user}) => {
            const userId = user.id;

            const recipe = await models.Recipe.findByPk(id, {
                include: [
                    {
                        model: models.User,
                        as: 'User',
                        where: {id: userId},
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
                throw new UserInputError('Recipe Not Found');
            }

            try {
                if (recipe.isFavorite === false) {
                    recipe.update({isFavorite: true});
                } else {
                    recipe.update({isFavorite: false});
                }
                return recipe;
            } catch (err) {
                throw new ApolloError(err);
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
