import gql from 'graphql-tag';

export default gql`
  type Query {
    user(numero: String!): User!
    getUserInfo(numero: String!): AuthPayload
    users: [User!]!
  }
  type Mutation {
    registerUser(nom: String!, prenom: String!, numero: String!): AuthPayload
  }
  type User {
    id: ID!
    nom: String!
    avatar: String
    prenom: String!
    numero: String!
    professional: Boolean
    verified: Boolean
    offerings: [Offering!]
    completedofferings: [Offering!]
    avisreceived: [Avis]
    avisgave: [Avis]
    channels: [Channel!]!
    messages: [Message!]!
    moyenne: Float
  }
  type AuthPayload {
    token: String
    user: User
  }
`;
