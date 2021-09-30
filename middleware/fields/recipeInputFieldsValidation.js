const Joi = require('joi');

const recipeFormValidation = (
  title,
  description,
  ingredients,
  instructions,
  image
) => {
  const schema = Joi.object()
    .keys({
      title: Joi.string().trim().min(3).required().messages({
        'string.empty': `Please input the title`,
        'string.min': `Title is at least 3 characters`,
      }),
      description: Joi.string().trim().min(5).required().messages({
        'string.empty': `Please input the description`,
        'string.min': `Description is at least 5 characters`,
      }),
      ingredients: Joi.array().items(
        Joi.string().trim().min(3).required().messages({
          'string.empty': `Enter an ingredient`,
          'string.min': `Ingredient is at least 3 characters`,
        })
      ),
      instructions: Joi.array().items(
        Joi.string().trim().min(3).required().messages({
          'string.empty': `Enter an instruction`,
          'string.min': `Instruction is at least 3 characters`,
        })
      ),
      image: Joi.string().trim().required().messages({
        'string.empty': `Image is required`,
      }),
    })
    .options({ abortEarly: false });
  return schema.validate(title, description, ingredients, instructions, image);
};

const recipeUpdateFormValidation = (
  title,
  description,
  ingredients,
  instructions,
  image
) => {
  const schema = Joi.object()
    .keys({
      title: Joi.string().trim().min(3).required().messages({
        'string.empty': `Please input the title`,
        'string.min': `Title is at least 3 characters`,
      }),
      description: Joi.string().trim().min(5).required().messages({
        'string.empty': `Please input the description`,
        'string.min': `Description is at least 5 characters`,
      }),
      ingredients: Joi.array().items(
        Joi.object().keys({
          id: Joi.optional(),
          recipeId: Joi.string().optional(),
          ingredient: Joi.string().trim().min(3).required().messages({
            'string.empty': `Please input the ingredient`,
            'string.min': `Ingredient is at least 3 characters`,
          }),
        })
      ),
      instructions: Joi.array().items(
        Joi.object().keys({
          id: Joi.optional(),
          recipeId: Joi.string().optional(),
          instruction: Joi.string().trim().min(5).required().messages({
            'string.empty': `Please input the instruction`,
            'string.min': `Instruction is at least 5 characters`,
          }),
        })
      ),
      image: Joi.string().trim().required().messages({
        'string.empty': `Image is required`,
      }),
    })
    .options({ abortEarly: false });
  return schema.validate(title, description, ingredients, instructions, image);
};

module.exports = { recipeFormValidation, recipeUpdateFormValidation };
