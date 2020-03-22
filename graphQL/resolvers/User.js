import jwt from 'jsonwebtoken'
import { APP_SECRET_CODE } from './utils'

export default {
  Query: {
    // TODO sanitization on provided id
    user: async (parent, { numero }, context, info) => {
      const user = await context.prisma.user({ numero })
      if (!user) return new Error('Utilisateur non existant')
      return user
    },
    // TODO check that the user is authenticated for seeing users list
    // TODO projection efficiently get the field asked for
    // TODO implement pagination
    users: async (parent, args, context, info) => {
      return context.prisma.users()
    }
  },
  Mutation: {
    enregistrement: async (parent, { nom, prenom, numero }, context, info) => {
      const user = await context.prisma.createUser({ nom, prenom, numero })
      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE)

      return {
        token,
        user
      }
    },
    verification: async (parent, { numero }, context, info) => {
      const user = await context.prisma.user({ numero })
      if (!user) {
        throw new Error('Utilisateur non existant')
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE)

      return {
        token,
        user
      }
    }
  },
  User: {
    offerings: async (parent, args, { prisma }, info) => {
      const offerings = await prisma.user({ id: parent.id }).offerings()
      return offerings
    },
    channels: async (parent, args, { prisma }, info) => {
      const channels = await prisma.channels({ where: { users_some: { id: parent.id } } })
      return channels
    },
    messages: async (parent, args, { prisma }, info) => {
      const channels = await prisma.messages({ where: { sentBy: { id: parent.id } } })
      return channels
    }
  }
}
