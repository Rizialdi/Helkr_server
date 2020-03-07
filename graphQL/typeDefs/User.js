import { gql } from 'apollo-server-express'

export default gql`
  type User {
    _id: ID!
    nom: String!
    prenom: String!
    numero: String!
  }
  type Query {
    user(_id: ID!): User #pas obigatoire si invalid id fourni
    users: [User!]!
  }
  type Mutation {
    enregistrement(nom: String!, prenom: String!, numero: String!): User!
    verification(numero: String!): User!
  }
`
