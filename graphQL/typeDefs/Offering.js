import gql from 'graphql-tag';

export default gql`
  type Query {
    offerings: [Offering!]!
    incompleteOfferings(filters: [String!]): [Offering]
    offeringById(id: String!): Offering!
    isCandidateTo: [AppliedStatus!]!
    myIncompleteOffering: [Offering!]!
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
    candidateToOffering(id: String!): ApplyTo
    updateOffering(id: String!, description: String!): Boolean!
    completeOffering(id: String!, completedById: String!): Boolean!
    chooseCandidate(id: String!, candidateId: String!): Boolean!
  }
  type Subscription {
    newOffering(tags: [String!]): OfferingSubscriptionResponse!
    updateAppliedTo(userId: String!): AppliedStatusSubscription!
  }
  type Offering {
    id: ID!
    type: String!
    author: User!
    createdAt: String!
    completedBy: User
    selectedCandidate: User
    details: String!
    category: String!
    candidates: [User!]!
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
  type ApplyTo {
    success: Boolean!
  }
  type AppliedStatus {
    id: String!
    type: String!
    createdAt: String!
    category: String!
    description: String!
    status: String!
  }
  type AppliedStatusSubscription {
    id: String!
    status: String!
  }
`;
