/* eslint-disable no-self-compare */
/* eslint-disable prefer-const */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {AuthenticationError} = require('apollo-server-express');
// eslint-disable-next-line import/no-extraneous-dependencies
const {ApolloError, UserInputError} = require('apollo-server-errors');
const crypto = require('crypto');
const models = require('../../../database/models');
const {
    validateRegister,
    validateLogin,
    validateEmail,
    validateExistUser,
} = require('../../../middleware/auth/authValidation');
const {
    userFormValidation,
} = require('../../../middleware/fields/userInputFieldsValidation');
const sendEmail = require('../../../utils/sendEmail');
const {
    resetPasswordValidate,
} = require('../../../middleware/fields/resetPasswordInputField');

module.exports = {
    Query: {
        currentUser: async (_, args, {user}) => {
            if (!user) {
                throw new Error('You are not authenticated');
            }
            const me = models.User.findByPk(user.id);
            return me;
        },
    },
    Mutation: {
        register: async (_, args) => {
            const {fullname, email, password, gender, birthDate} = args.input;
            const {error} = validateRegister(args.input);

            if (error) {
                console.log(`birthdate: ${error.details[0].message}`);
                throw new UserInputError(error.details[0].message);
            }

            try {
                const userEmail = await models.User.findOne({
                    where: {email},
                    attributes: ['email'],
                });
                await validateEmail(userEmail);

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const user = await models.User.create({
                    fullname,
                    email,
                    password: hashedPassword,
                    gender,
                    birthDate
                });
                console.log(`birthdate: ${user}`);

                const token = jwt.sign(
                    {id: user.id, email: user.email},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    }
                );

                return {
                    token,
                    user,
                };
            } catch (err) {
                throw new AuthenticationError(err.message);
            }
        },

        login: async (_, {email, password}) => {
            const {error} = await validateLogin(email, password);
            if (error) {
                throw new UserInputError(error.details[0].message);
            }

            const user = await models.User.findOne({where: {email}});
            await validateExistUser(user, password);

            try {
                const token = jwt.sign(
                    {id: user.id, email: user.email},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    }
                );
                return {token, user};
            } catch (err) {
                throw new AuthenticationError(err.message);
            }
        },

        userUpdate: async (_, {id, input}) => {
            const {fullname, email, password, gender, birthDate} = input;

            const {error} = userFormValidation(input);
            if (error) {
                throw new UserInputError(error.details[0].message);
            }

            const user = await models.User.findByPk(id);
            if (!user) {
                throw new ApolloError('User not found');
            }

            try {
                const userUpdated = await user.update({
                    fullname,
                    email,
                    password: await bcrypt.hash(password, 10),
                    gender,
                    birthDate
                });
                return userUpdated;
            } catch (err) {
                throw new Error(`Failed update user: ${err.message}`);
            }
        },

        regeneratePasswordResetLink: async (_, {email}) => {
            try {
                const user = await models.User.findOne({where: {email}});
                if (!user) {
                    throw new Error("user with given email doesn't exist");
                }

                let token = await models.Token.findOne({userId: user.id});
                if (!token) {
                    token = await models.Token.create({
                        userId: user.id,
                        token: crypto.randomBytes(32).toString('hex'),
                    });
                }

                const link = `${process.env.BASE_URL}/password-reset/${user.id}/${token.token}`;

                await sendEmail(user.email, 'Password Reset', link);
                return 'Email was sent';
            } catch (err) {
                throw new Error(err);
            }
        },

        passwordReset: async (_, {input}) => {
            const {link, password} = input;
            const url = 'http://localhost:8080/api/v1/password-reset/';

            // Joi Validation
            const {error} = await resetPasswordValidate(input);
            if (error) {
                throw new UserInputError(error.details[0].message);
            }

            const splitLink = link.split('/');
            const userToken = splitLink[7];
            const id = parseInt(splitLink[6], 10);

            try {
                const user = await models.User.findByPk(id);
                if (!user) {
                    throw new Error('User not found');
                }
                const token = await models.Token.findOne({
                    userId: user.id,
                    token: userToken,
                });

                // concate user static link, user, token
                const userId = token.userId.toString();
                const urlToken = `/${token.token}`;
                const concateUrlUserIdToken = url.concat(userId + urlToken);

                if (concateUrlUserIdToken !== link) {
                    throw new Error('Invalid link or expired.');
                }

                await user.update({
                    password: await bcrypt.hash(password, 10),
                });

                await token.destroy();

                return 'Password reset successfully.';
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};
