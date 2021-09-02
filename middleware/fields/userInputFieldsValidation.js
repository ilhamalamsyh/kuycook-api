const Joi = require('joi');

const pattern = '[A-Za-z0-9d$@$!%*?&.]{8,}$';

const userFormValidation = (fullname, email, password, gender) => {
  const schema = Joi.object().keys({
    fullname: Joi.string().trim().min(3).required(),
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
      .required(),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp(pattern))
      .required(),
    gender: Joi.string().trim().required(),
  });
  return schema.validate(fullname, email, password, gender);
};

module.exports = { userFormValidation };
