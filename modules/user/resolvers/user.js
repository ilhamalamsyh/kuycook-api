const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthenticationError } = require("apollo-server-express");
const { ApolloError } = require("apollo-server-errors");

const { User } = require("../../../database/models");
const user = require("../schemas/user");

module.exports = {
  Mutation: {
    register: async (root, args, context) => {
      //TODO:Add validation of registration
      const { fullname, email, password, gender } = args.input;
      return User.create({
        fullname,
        email,
        password: await bcrypt.hash(password, 10),
        gender,
      });
    },

    login: async (root, { input }, context) => {
      //TODO:Add validation of login
      const { email, password } = input;
      const user = await User.findOne({ where: { email } });
      console.log(user.password);

      //TODO:Add validation of login
      const { email, password } = input;
      const user = await User.findOne({ where: { email } });

      try {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          return { ...user.toJSON(), token };
        }
      } catch (error) {
        throw new AuthenticationError("Invalid Credential");
      }
    },

    userUpdate: async (parent, { id, input }, context) => {
      //TODO:Add validation of updateUser
      try {
        const { fullname, email, password, gender } = input;
        const user = await User.findByPk(id);
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
        throw new Error(`Failed update user: ${error}`);
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
