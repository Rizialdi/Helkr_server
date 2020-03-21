import gql from 'graphql-tag'

export default gql`
  type Query {
    channel(channelId: String!): Channel! 
    channels: [Channel!]!
  }
  type Mutation {
    createChannel(sentBy: String!, receivedBy: String!): channelResponse!
  }
  type Channel {
    id: ID!
    messages: [Message!]!
    users: [User!]!
  }
  type channelResponse {
    success: Boolean!
    channel: Channel
  }
`
