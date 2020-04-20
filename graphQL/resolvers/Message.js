import { getUserId } from './utils'
import { PUB_NEW_MESSAGE } from '../constants'
import { withFilter } from 'graphql-yoga'

export default {
  Query: {
    messages: async (_, { channelId }, context) => {
      const results = await context.prisma.channel.findMany({ where: { id: channelId } }).messages()

      if (!results) return new Error('Aucun messages trouves')
      return results
    }
  },
  Mutation: {
    createMessage: async (_, { channelId, recipient, text }, context) => {
      const userId = getUserId(context)
      // if a channelId is given, aka not delete

      if (channelId) {
        try {

          const message = await context.prisma.message.create({ data: { text, sentBy: { connect: { id: userId } }, channel: { connect: { id: channelId } } }})
          if (!message) return false
          message.channelId = channelId
          message.userId = userId
          context.pubsub.publish(PUB_NEW_MESSAGE, { newMessage: message })
          return true
        } catch (error) {
          throw new Error('La creation du message a echoue')
        }
      }

      // if no channelId is given, check if one already exist
      const results = await context.prisma.channels({ where: { AND: [{ users_some: { id: userId } }, { users_some: { id: recipient } }] } })

      if (userId === recipient) return false

      if (results[0]) {
        try {
          const channelId = results[0].id
          const message = await context.prisma.createMessage({ channel: { connect: { id: channelId } }, text, sentBy: { connect: { id: userId } } })
          if (!message) return false
          message.channelId = channelId
          message.userId = userId
          context.pubsub.publish(PUB_NEW_MESSAGE, { newMessage: message })
          return true
        } catch (error) {
          throw new Error('La creation du message a echoue')
        }
      }

      // default case, create a channel and continue
      try {
        const channel = await context.prisma.createChannel({ users: { connect: [{ id: recipient }, { id: userId }] } })
        if (!channel) {
          throw new Error('La creation de Channel a echoue')
        }
        const channelId = channel.id
        const message = await context.prisma.createMessage({ channel: { connect: { id: channelId } }, text, sentBy: { connect: { id: userId } } })
        if (!message) return false
        message.channelId = channelId
        message.userId = userId
        context.pubsub.publish(PUB_NEW_MESSAGE, { newMessage: message })
        return true
      } catch (error) {
        throw new Error('La creation de Channel ou de message a echoue')
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_MESSAGE),
        (payload, variables) => {
          return payload.newMessage.channelId === variables.channelId
        }
      )
    }
  },
  Message: {
    channel: async (parent, __, { prisma }) => {
      const channel = await prisma.channels({ where: { messages_some: { id: parent.id } } })
      return channel[0]
    },
    sentBy: async (parent, __, { prisma }) => {
      const sentBy = await prisma.users({ where: { messages_some: { id: parent.id } } })
      return sentBy[0]
    }
  }
}
