import { getUserId } from './utils'

export default {
  Query: {
    messages: async (parent, { channelId }, context, info) => {
      const messages = await context.prisma.message({ channelId })
      if (!messages) return new Error('Aucun messages trouves')
      return messages
    }
  },
  Mutation: {
    createMessage: async (parent, { channelId, text }, context, info) => {
      try {
        const userId = getUserId(context)
        const message = await context.prisma.createMessage({ channel: { connect: { id: channelId } }, text, sentBy: { connect: { id: userId } } })
        if (!message) return false
        return true
      } catch (error) {
        throw new Error('La creation du message a echoue')
      }
    }
  },
  Message: {
    channel: async (parent, args, { context }, info) => {
      // TODO verifier channel() ?
      const channel = await context.prisma.message({ id: parent.id }).channel()
      return channel
    },
    sentBy: async (parent, args, { context }, info) => {
      // TODO verifier user() ?
      const user = await context.prisma.message({ id: parent.id }).user()
      return user
    }
  }
}
