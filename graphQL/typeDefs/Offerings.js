import gql from 'graphql-tag'

export default gql`
  type Query {
    offeringsUser(numero: String!): Offering!
    offerings: [Offering!]!
  }
  type Mutation {
    ajouter(type: String!, category: String!, description: String!): Offering!
    modifier(id: String!,description: String!): Offering!
  }
  type User {
    id: ID!
    nom: String!
    prenom: String!
    numero: String!
    offerings: [Offering!]!
  }
  type Offering {
    id: ID!
    type: String!
    category: String!
    description: String!
    author: User!
  }
`
