const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');

// eslint-disable-next-line
const pattern = '[A-Za-z0-9d$@$!%*?&.]{8,}$';

function validateRegister(register) {
  const schema = Joi.object({
    fullname: Joi.string().trim().min(8).required(),
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
  return schema.validate(register);
}

function validateLogin(email, password) {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
      .required(),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp(pattern))
      .required(),
  });
  return schema.validate({ email, password });
}

const validateEmail = (email) => {
  if (email) {
    throw new Error('Email has been used!');
  }
};

const validateExistUser = async (user, password) => {
  if (!user) {
    throw new AuthenticationError('No User with that email');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AuthenticationError('Invalid Password');
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEmail,
  validateExistUser,
};
