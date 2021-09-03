const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');

// const pattern = '[A-Za-z0-9d$@$!%*?&.]{8,}$';

function validateRegister(register) {
  const schema = Joi.object({
    fullname: Joi.string().trim().min(8).required().messages({
      'string.base': `"Fullname" should be a text type`,
      'string.empty': `Enter Fullname`,
      'string.min': `Use at least 8 characters`,
      'any.required': `"fullname" is required`,
    }),
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
      .required()
      .messages({
        'string.base': `"Email" should be a text type`,
        'string.email': `Email format should be ".com" or ".net"`,
        'string.empty': `Enter Email`,
      }),
    password: Joi.string().trim().min(8).required().messages({
      'string.base': `"Password" should be a text type`,
      'string.empty': `Please input a stronger password. Try a mix of letters, numbers, and symbols`,
      'string.min': `Use at least 8 characters`,
    }),
    gender: Joi.string().trim().max(1).required().messages({
      'string.empty': `Select Gender`,
      'string.max': 'Select Gender',
    }),
  });
  return schema.validate(register, { abortEarly: false });
}

function validateLogin(email, password) {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
      .required()
      .messages({
        'string.base': `"Email" should be a text type`,
        'string.email': `Email format should be ".com" or ".net"`,
        'string.empty': `Enter Email`,
      }),
    password: Joi.string().trim().required().messages({
      'string.base': `"Password" should be a text type`,
      'string.empty': `Enter Password`,
    }),
  });
  return schema.validate({ email, password }, { abortEarly: false });
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
    throw new AuthenticationError('Incorrect Password');
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEmail,
  validateExistUser,
};
