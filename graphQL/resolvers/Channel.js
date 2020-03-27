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
    },
    recipientChannels: async (parent, args, context, info) => {
      const userId = '5e7dfde324aa9a0007929a6b' // getUserId(context)
      const channels = await context.prisma.channels({ where: { users_some: { id: userId } } })
      const channelIds = channels.map(channel => channel.id)
      const users = await context.prisma.users({ where: { AND: [{ channels_some: { id_in: channelIds } }, { id_not: userId }] } })
      const mapping = []
      for (var i = 0; i < channelIds.length; i++) {
        const messages = await context.prisma.messages({ where: { channel: { id: channelIds[i] } } })
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
      const messages = await prisma.messages({ orderBy: 'createdAt_DESC', where: { channel: { id: parent.id } } })
      return messages
    },
    users: async (parent, args, { prisma }, info) => {
      const users = await prisma.users({ where: { channels_some: { id: parent.id } } })
      return users
    }
  }
}
