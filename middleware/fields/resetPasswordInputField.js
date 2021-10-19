const Joi = require('@hapi/joi');

const resetPasswordValidate = (data) => {
  const schema = Joi.object().keys({
    link: Joi.string().trim().required().messages({
      'string.empty': `Please input the link`,
      'string.min': `Link is at least 5 characters`,
    }),
    password: Joi.string().trim().min(8).required().messages({
      'string.base': `"Password" should be a text type`,
      'string.empty': `Please input a stronger password. Try a mix of letters, numbers, and symbols`,
      'string.min': `Use at least 8 characters`,
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = { resetPasswordValidate };
