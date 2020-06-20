import gql from 'graphql-tag'

export default gql`
  type Query {
    messages(channelId: String!): [Message!]!
  }
  type Mutation {
    createMessage(channelId: String, recipient: String, text: String!): Boolean!
  }
  type Subscription {
    newMessage(channelId: String!): messageSubscriptionResponse!
  }
  type Message {
    id: ID!
    text: String!
    sentBy: User!
    channel: Channel!
    createdAt: String!
  }
  type messageSubscriptionResponse {
    id: ID!
    text: String!
    userId: String!
    channelId: String!
    createdAt: String!
  }
`
