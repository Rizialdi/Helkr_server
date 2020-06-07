import gql from 'graphql-tag';

export default gql`
  type Query {
    offerings: [Offering!]!
    incompleteOfferings(filters: [String!]): [Offering]
    offeringById(id: String!): Offering!
    offeringsUser(numero: String!): Offering!
  }
  type Mutation {
    addOffering(
      type: String!
      category: String!
      description: String!
      details: String!
    ): Boolean!
    deleteOffering(id: String!): Boolean!
    updateOffering(id: String!, description: String!): Boolean!
    completeOffering(id: String!, completedById: String!): Boolean!
  }
  type Subscription {
    newOffering(tags: [String!]): OfferingSubscriptionResponse!
  }
  type Offering {
    id: ID!
    type: String!
    author: User!
    createdAt: String!
    completedBy: User
    details: String!
    category: String!
    completed: Boolean
    description: String!
    avis: [Avis!]!
  }
  type OfferingSubscriptionResponse {
    id: ID!
    type: String!
    category: String!
    createdAt: String!
    description: String!
  }
`;
