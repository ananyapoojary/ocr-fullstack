const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type OCRResult {
    id: ID!
    imageUrl: String!
    text: String!
  }

  type Query {
    getResults: [OCRResult]
  }

  type Mutation {
    uploadImage(imageUrl: String!): OCRResult
  }
`;

module.exports = typeDefs;
