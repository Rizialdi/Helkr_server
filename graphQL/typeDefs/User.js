import gql from 'graphql-tag';

export default gql`
  type Query {
    user(numero: String!): User!
    userById(id: String!): User!
    getUserInfo(numero: String!): AuthPayload
    users: [User!]!
    getUserStats(id: String!): Stats
  }
  type Mutation {
    registerUser(nom: String!, prenom: String!, numero: String!): AuthPayload
    avatarUpload(file: Upload!): Boolean
    descriptionUpdate(text: String!): Boolean
    addressUpdate(text: String!): Boolean
  }
  type User {
    id: ID!
    nom: String!
    avatar: String
    prenom: String!
    numero: String!
    tags: [String]
    address: String
    description: String
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
  type Stats {
    done: Int
    proposed: Int
    average: Float
  }
  scalar Upload
`;
