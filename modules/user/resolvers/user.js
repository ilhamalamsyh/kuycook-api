const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ApolloError, UserInputError } = require('apollo-server-errors');
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

module.exports = {
  Mutation: {
    register: async (_, args) => {
      const { fullname, email, password, gender } = args.input;
      const { error } = validateRegister(args.input);

      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      const userEmail = await models.User.findOne({ where: { email } });
      await validateEmail(userEmail);

      try {
        const user = await models.User.create({
          fullname,
          email,
          password: await bcrypt.hash(password, 10),
          gender,
        });

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        return { token, user, message: 'Authentication Successful!' };
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },

    login: async (_, { email, password }) => {
      const { error } = await validateLogin(email, password);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      const user = await models.User.findOne({ where: { email } });
      await validateExistUser(user, password);

      try {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );
        return { token, user };
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },

    userUpdate: async (_, { id, input }) => {
      const { fullname, email, password, gender } = input;

      const { error } = userFormValidation(input);
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
        });
        return userUpdated;
      } catch (err) {
        throw new Error(`Failed update user: ${err.message}`);
      }
    },
  },
};
