const Joi = require('joi');

const articleFormValidate = (title, description, image) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(5).required(),
    description: Joi.string().trim().min(20).required(),
    image: Joi.string().trim().required(),
  });
  return schema.validate(title, description, image);
};

module.exports = { articleFormValidate };
