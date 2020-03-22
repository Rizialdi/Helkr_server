import { getUserId } from './utils'

export default {
  Query: {
    channel: async (parent, { id }, context, info) => {
      console.log(id)
      const channel = await context.prisma.channel({ id })
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
    messages: async (parent, args, { prisma }, info) => {
      const messages = await prisma.messages({ where: { channel: { id: parent.id } } })
      return messages
    },
    users: async (parent, args, { prisma }, info) => {
      const users = await prisma.users({ where: { channels_some: { id: parent.id } } })
      return users
    }
  }
}
