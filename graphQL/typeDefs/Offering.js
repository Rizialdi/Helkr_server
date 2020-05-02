import gql from 'graphql-tag';

export default gql`
  type Query {
    offerings: [Offering!]!
    offeringsUser(numero: String!): Offering!
  }
  type Mutation {
    addOffering(
      type: String!
      category: String!
      description: String!
    ): Boolean!
    deleteOffering(id: String!): Boolean!
    updateOffering(id: String!, description: String!): Boolean!
    completeOffering(id: String!, completedById: String!): Boolean!
  }
  type Offering {
    id: ID!
    type: String!
    author: User!
    completedBy: User
    category: String!
    completed: Boolean
    description: String!
    avis: [Avis!]!
  }
`;
