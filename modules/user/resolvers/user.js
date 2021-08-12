const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const models = require("../../../database/models");
const { AuthenticationError } = require("apollo-server-express");
const { ApolloError } = require("apollo-server-errors");
const {
  validateRegister,
  validateLogin,
} = require("../../../shared/authValidation");

module.exports = {
  Mutation: {
    register: async (root, args, context) => {
      try {
        const { fullname, email, password, gender } = args.input;

        const { error } = validateRegister(args.input);
        if (error) {
          throw new Error(error.details[0].message);
        }

        const validateEmail = await models.User.findOne({ where: { email } });
        if (validateEmail) {
          throw new Error("Email has been used!");
        }
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

        return { token, user, message: "Authentication Successful!" };
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },

    login: async (_, { email, password }, context) => {
      try {
        const { error } = await validateLogin(email, password);
        if (error) {
          throw new Error(error.details[0].message);
        }

        const user = await models.User.findOne({ where: { email } });
        if (!user) {
          throw new AuthenticationError("No User with that email");
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new AuthenticationError("Invalid Password");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );
        return { token, user };
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    },

    userUpdate: async (parent, { id, input }, context) => {
      //TODO:Add validation of updateUser
      try {
        const { fullname, email, password, gender } = input;
        const user = await models.User.findByPk(id);
        if (!user) {
          throw new ApolloError("User not found");
        }

        const userUpdated = await user.update({
          fullname,
          email,
          password: await bcrypt.hash(password, 10),
          gender,
        });
        return userUpdated;
      } catch (error) {
        throw new Error(`Failed update user: ${error.message}`);
      }
    },
  },
};

// updateUser: async (root, { id, input }, context) => {
//     const { fullname, password, email, gender } = input;
//     console.log(id);
//     try {
//         // if (!user) {
//         //     throw new AuthenticationError('You must login to update a user');
//         // }
//         return await User && User.update({
//             fullname,
//             email,
//             password,
//             gender
//         }, {where: {id: id}});
//         console.log(`UserUpdate: ${user}`);

//     } catch (error) {
//         throw new Error(`something went wrong: ${error}`)
//     }
// }
