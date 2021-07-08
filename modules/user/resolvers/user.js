const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server-express');
import { ApolloError } from 'apollo-server-errors';


const { User } = require('../../../database/models');

module.exports = {
    Mutation:{
        register: async (root, args, context) => {
            const {name, email, password, gender} = args.input;
            return User.create({name, email, password, gender});
        },

        login: async (root, { input }, context) => {
            const { email, password} = input;
            const user = await User.findOne({where: {email}});
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ id: user.id }, 'mysecret', {expiresIn:'1d'});
                return {...user.toJson(), token};
            }
            throw new AuthenticationError('Invalid Credential');
        },

        updateUser: async (root, context, {
            id,
            name,
            email,
            password,
            gender
        }) => {
            try {
                const user = await User && User.update({
                    name,
                    email,
                    password,
                    gender
                }, {where: {id: id}});
                return {...user.toJson()}
            } catch (error) {
                throw new ApolloError('Error Update User', 'MY_ERROR_CODE', error);
            }
        }
    },
};
