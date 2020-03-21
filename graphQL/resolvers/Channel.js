import { getUserId } from './utils'

export default {
  Query: {
    channel: async (parent, { ChannelId }, context, info) => {
      const channel = await context.prisma.channel({ id: ChannelId })
      if (!channel) return new Error('Chaine inexistante')
      return channel
    },
    channels: async (parent, args, context, info) => {
      return context.prisma.channels()
    }
  },
  Mutation: {
    createChannel: async (parent, { recipient }, context, info) => {
      try {
        const sentBy = getUserId(context)
        const channel = await context.prisma.createChannel({ users: { connect: [{ id: recipient }, { id: sentBy }] } })

        if (!channel) {
          return {
            success: false,
            channel
          }
        }
        return {
          success: true,
          channel
        }
      } catch (error) {
        throw new Error('La creation de chaine a echoue')
      }
    }
  },
  Channel: {
    messages: async (parent, args, { context }, info) => {
      const messages = await context.prisma.channel({ id: parent.id }).messages()
      return messages
    },
    users: async (parent, args, { context }, info) => {
      const users = await context.prisma.channel({ id: parent.id }).users()
      return users
    }
  }
}
