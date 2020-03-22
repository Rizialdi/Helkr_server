import { getUserId } from './utils'

export default {
  Query: {
    messages: async (parent, { channelId }, context, info) => {
      const results = await context.prisma.channels({ where: { id: channelId } }).messages()
      const messages = results[0].messages
      if (!messages) return new Error('Aucun messages trouves')
      return messages
    }
  },
  Mutation: {
    createMessage: async (parent, { recipient, text }, context, info) => {
      const sentBy = getUserId(context)
      const results = await context.prisma.channels({ where: { AND: [{ users_some: { id: sentBy } }, { users_some: { id: recipient } }] } })

      if (sentBy === recipient) return false

      if (results[0]) {
        try {
          const channelId = results[0].id
          const message = await context.prisma.createMessage({ channel: { connect: { id: channelId } }, text, sentBy: { connect: { id: sentBy } } })
          if (!message) return false
          return true
        } catch (error) {
          throw new Error('La creation du message a echoue')
        }
      }

      try {
        const channel = await context.prisma.createChannel({ users: { connect: [{ id: recipient }, { id: sentBy }] } })
        if (!channel) {
          throw new Error('La creation de Channel a echoue')
        }
        const channelId = channel.id
        const message = await context.prisma.createMessage({ channel: { connect: { id: channelId } }, text, sentBy: { connect: { id: sentBy } } })
        if (!message) return false
        return true
      } catch (error) {
        throw new Error('La creation de Channel ou de message a echoue')
      }
    }
  },
  Message: {
    channel: async (parent, args, { prisma }, info) => {
      const channels = await prisma.channels({ where: { messages_some: { id: parent.id } } })
      return channels
    },
    sentBy: async (parent, args, { prisma }, info) => {
      const sentBy = await prisma.users({ where: { messages_some: { id: parent.id } } })
      return sentBy[0]
    }
  }
}
