import gql from 'graphql-tag'

export default gql`
  type Query {
    messages(channelId: String!): [Message!]!
  }
  type Mutation {
    createMessage(channelId: String!, text: String!): Boolean!
  }
  type Message {
    id: ID!
    text: String!
    sentBy: User!
    channel: Channel!
    createAt: String!
  }
`
