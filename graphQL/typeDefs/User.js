import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    user(_id: ID!): User #pas obigatoire si invalid id fourni
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
  }
  type AuthPayload {
  token: String
  user: User
  }
`
