const Joi = require("joi");

function validateRegister(register) {
  const schema = Joi.object({
    fullname: Joi.string().min(5).max(50).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: ["com", "net"] })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    gender: Joi.string().required(),
  });
  return schema.validate(register);
}

function validateLogin(email, password) {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: ["com", "net"] })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return schema.validate({ email, password });
}

module.exports = { validateRegister, validateLogin };
