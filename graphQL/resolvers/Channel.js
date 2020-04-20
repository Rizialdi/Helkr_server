import { getUserId } from './utils'

export default {
  Query: {
    channel: async (parent, { id }, context, info) => {
      const channel = await context.prisma.channel.findOne({ where: { id }})
      if (!channel) return new Error('Chaine inexistante')
      return channel
    },
    channels: async (parent, args, context, info) => {
      return context.prisma.channel.findMany()
    },
    recipientChannels: async (parent, args, context, info) => {
      const userId = getUserId(context)
      const channels = await context.prisma.channel.findMany({ where: { users: { some: { id: userId }} } })
      const channelIds = channels.map(channel => channel.id)
      const users = await context.prisma.user.findMany({ where: { AND: [{ channels: { some: { id: { in: channelIds } }} }, { id: { not: userId } }] } })
      const mapping = []
      for (var i = 0; i < channelIds.length; i++) {
        const messages = await context.prisma.message.findMany({ where: { channel: { id: channelIds[i] } } })
        const lastMessage = messages[messages.length - 1]
        mapping.push(lastMessage)
      }
      const lastMessages = JSON.stringify(mapping)
      return {
        users,
        channelIds,
        lastMessages
      }
    }
  },
  Mutation: {
    createChannel: async (parent, { recipient }, context, info) => {
      try {
        const sentBy = getUserId(context)
        const channel = await context.prisma.channel.create({ data: { users: { connect: [{ id: recipient }, { id: sentBy }] } }})

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
    messages: async (parent, _, { prisma }) => {
      const messages = await prisma.message.findMany({ orderBy: {createdAt: "desc"}, where: { channel: { id: parent.id } } })
      return messages
    },
    users: async (parent, _, { prisma }) => {
      const users = await prisma.user.findMany({ where: { channels: { some: { id: parent.id }} } })
      return users
    }
  }
}
