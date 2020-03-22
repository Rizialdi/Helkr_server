import gql from 'graphql-tag'

export default gql`
  type Query {
    user(numero: String!): User! #pas obigatoire si invalid num fourni
    users: [User!]!
  }
  type Mutation {
    enregistrement(nom: String!, prenom: String!, numero: String!): AuthPayload
    verification(numero: String!): AuthPayload
  }
  type User {
    id: ID!
    nom: String!
    prenom: String!
    numero: String!
    offerings: [Offering!]!
    channels: [Channel!]!
    messages: [Message!]!
  }
  type AuthPayload {
  token: String
  user: User
  }
`
