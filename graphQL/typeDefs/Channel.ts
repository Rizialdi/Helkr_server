import gql from 'graphql-tag'

export default gql`
  type Query {
    channel(id: String!): Channel! 
    channels: [Channel!]!
    recipientChannels: recipientChannelsResponse!
  }
  type Mutation {
    createChannel(recipient: String!): channelResponse!
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
  type recipientChannelsResponse {
    users: [User!]!,
    channelIds: [String!]!
    lastMessages: String!
  }
`
