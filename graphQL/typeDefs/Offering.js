import gql from 'graphql-tag'

export default gql`
  type Query {
    offeringsUser(numero: String!): Offering!
    offerings: [Offering!]!
  }
  type Mutation {
    addOffering(type: String!, category: String!, description: String!): Offering!
    updateOffering(id: String!,description: String!): Offering!
  }
  type Offering {
    id: ID!
    type: String!
    category: String!
    description: String!
    author: User!
  }
`
