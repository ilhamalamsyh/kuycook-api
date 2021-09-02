const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const models = require('../../database/models');

const verifyToken = async (token) => {
  try {
    if (!token) return null;
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.User.findByPk(id);
    return user;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

module.exports = async ({ req }) => {
  const token = (req.headers && req.headers.authorization) || '';
  const user = await verifyToken(token);
  return { user };
};
