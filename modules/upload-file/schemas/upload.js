const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar Upload

    extend type Mutation {
        singleUploadImage(type: String! ,file: Upload!): String!
    }
`;