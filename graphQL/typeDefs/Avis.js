import gql from 'graphql-tag';

export default gql`
  type Query {
    getAvis: [Avis!]!
    getAvisUser(userId: String!): [Avis!]!
  }
  type Mutation {
    createAvis(
      scoredId: String!
      comment: String!
      score: Int!
      offeringId: String!
    ): Boolean!
  }
  type Subscription {
    newAvis(userId: String!): avisSubscriptionResponse!
  }
  type Avis {
    id: ID!
    score: Int!
    scorer: User!
    scored: User!
    comment: String!
    createdAt: String!
    offering: Offering!
  }
  type avisSubscriptionResponse {
    id: ID!
    score: String!
    scorer: String!
    comment: String!
    createdAt: String!
  }
`;
