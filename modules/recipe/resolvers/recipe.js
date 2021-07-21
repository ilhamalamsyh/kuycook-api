const { User, Recipe,  RecipeIngredient, RecipeInstruction, RecipeMedia} = require('../../../database/models');

const { AuthenticationError, UserInputError } = require('apollo-server-express');

//TODO: bikin transaction create using "unmanaged transaction" dengan beberapa model yg dibutuhkan

module.exports = {
    Query: {
        recipeList: async (root, args, { user }) => {
            try {
                const userId = user.id;
                return Recipe.findAll({
                        include:[
                        {
                            model: User,
                            as: 'User',
                            where: {id: userId}
                        },{
                            model: RecipeIngredient,
                            as: 'ingredients',
                            required: true,
                        },{
                            model: RecipeInstruction,
                            as: 'instructions',
                            require:true
                        },{
                            model: RecipeMedia,
                            as:'image',
                            require: true
                        }]
                    });
            } catch (error) {
                throw new Error(error);
            }
        },

        recipeDetail: async (_, { id }, { user }) => {
            try {
                userId = user.id;
                return Recipe.findByPk(id,{
                    include: [
                    {
                        model: User,
                        as: 'User',
                        where: {id: userId}
                    },{
                        model: RecipeIngredient,
                        as: 'ingredients',
                        required: true,
                    },{
                        model: RecipeInstruction,
                        as: 'instructions',
                        require:true
                    },{
                        model: RecipeMedia,
                        as:'image',
                        require: true
                    }]
                });   
            } catch (error) {
                throw new Error(error);
            }
        }
    },


}


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