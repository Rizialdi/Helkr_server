import jwt from 'jsonwebtoken'
import { APP_SECRET_CODE } from './utils'

export default {
  Query: {
    // TODO sanitization on provided id
    user: async (_, { numero }, context) => {
      const user = await context.prisma.user.findOne({ where: { numero }})
      if (!user) return new Error('Utilisateur non existant')
      return user
    },
    getUserInfo: async (_, { numero }, context) => {
      const user = await context.prisma.user.findOne({ where: { numero }})
      if (!user) {
        throw new Error('Utilisateur non existant')
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE)

      return {
        token,
        user
      }
    },
    // TODO check that the user is authenticated for seeing users list
    // TODO projection efficiently get the field asked for
    // TODO implement pagination
    users: async (_, __, context) => {
      return context.prisma.user.findMany()
    }
  }, // TODO Update a User by adding an avatar
  Mutation: {
    registerUser: async (_, { nom, prenom, numero }, context) => {
      const user = await context.prisma.user.create({ data: { nom, prenom, numero }})
      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE)

      return {
        token,
        user
      }
    }
  },
  User: {
    offerings: async (parent, __, { prisma }) => {
      const offerings = await prisma.user.findOne({ where: { id: parent.id }}).offerings()
      return offerings
    },
    channels: async (parent, __, { prisma }) => {
      const channels = await prisma.channel.findMany({ where: { users: { some: { id: parent.id }} } })
      return channels
    },
    messages: async (parent, __, { prisma }) => {
      const messages = await prisma.message.findMany({ where: { sentBy: { id: parent.id } } })
      return messages
    }
  }
}
