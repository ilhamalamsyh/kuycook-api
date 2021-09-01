const Joi = require('joi');

const recipeFormValidation = (
  title,
  description,
  ingredients,
  instructions,
  image
) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(3).required(),
    description: Joi.string().trim().min(5).required(),
    ingredients: Joi.array().items(Joi.string().trim().min(3).required()),
    instructions: Joi.array().items(Joi.string().trim().min(3).required()),
    image: Joi.string().trim().required(),
  });
  return schema.validate(title, description, ingredients, instructions, image);
};

module.exports = { recipeFormValidation };
