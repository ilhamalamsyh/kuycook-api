const Joi = require('joi');

const bannerFormValidate = (title, image) => {
  const schema = Joi.object()
    .keys({
      title: Joi.string().trim().min(5).required().messages({
        'string.empty': `Please input the title`,
        'string.min': `Title is at least 5 characters`,
      }),
      image: Joi.string().trim().required().messages({
        'string.empty': `Image is required`,
      }),
    })
    .options({
      abortEarly: false,
    });
  return schema.validate(title, image);
};

module.exports = { bannerFormValidate };
