const Joi = require('joi');

const userFormValidation = (fullname, email, password, gender) => {
    const schema = Joi.object()
        .keys({
            fullname: Joi.string().trim().min(8).required().messages({
                'string.base': `"Fullname" should be a text type`,
                'string.empty': `Enter Fullname`,
                'string.min': `Use at least 8 characters`,
                'any.required': `"fullname" is required`,
            }),
            email: Joi.string()
                .trim()
                .email({minDomainSegments: 2, tlds: ['com', 'net']})
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
            birthDate: Joi.date().max('now').min('1947-01-01'),
        })
        .options({abortEarly: false});
    return schema.validate(fullname, email, password, gender);
};

const userUpdateFormValidation = (fullname, email, gender, birthDate, image) => {
    const schema = Joi.object()
        .keys({
            fullname: Joi.string().trim().min(8).required().messages({
                'string.base': `"Fullname" should be a text type`,
                'string.empty': `Enter Fullname`,
                'string.min': `Use at least 8 characters`,
                'any.required': `"fullname" is required`,
            }),
            email: Joi.string()
                .trim()
                .email({minDomainSegments: 2, tlds: ['com', 'net']})
                .required()
                .messages({
                    'string.base': `"Email" should be a text type`,
                    'string.email': `Email format should be ".com" or ".net"`,
                    'string.empty': `Enter Email`,
                }),
            gender: Joi.string().trim().max(1).required().messages({
                'string.empty': `Select Gender`,
                'string.max': 'Select Gender',
            }),
            birthDate: Joi.date().max('now').min('1947-01-01'),
            image: Joi.string().allow('')
        })
        .options({abortEarly: false});
    return schema.validate(fullname, email, gender, birthDate, image);
};

module.exports = { userFormValidation, userUpdateFormValidation };
