const Joi = require('joi');

const articleFormValidate = (title, description, image) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(5).required().messages({
      'string.empty': `Please input the title`,
      'string.min': `Title is at least 5 characters`,
    }),
    description: Joi.string().trim().min(20).required().messages({
      'string.empty': `Please input the description`,
      'string.min': `Description is at least 20 characters`,
    }),
    image: Joi.string().trim().required().messages({
      'string.empty': `Image is required`,
    }),
  });
  return schema.validate(title, description, image);
};

module.exports = { articleFormValidate };
