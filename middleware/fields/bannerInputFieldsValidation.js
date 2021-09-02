const Joi = require('joi');

const bannerFormValidate = (title, image) => {
  const schema = Joi.object().keys({
    title: Joi.string().trim().min(5).required(),
    image: Joi.string().trim().required(),
  });
  return schema.validate(title, image);
};

module.exports = { bannerFormValidate };
