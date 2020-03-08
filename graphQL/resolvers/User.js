import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'
import { APP_SECRET_CODE } from './utils'

export default {
  Query: {
    // TODO sanitization on provided id
    user: (parent, { _id }, context, info) => {
      return true
    },
    // TODO check that the user is authenticated for seeing users list
    // TODO projection efficiently get the field asked for
    // TODO implement pagination
    users: async (parent, args, context, info) => {
      const users = await context.prisma.users()
      return true
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
        throw AuthenticationError('Utilisateur non trouve')
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE)

      return {
        token,
        user
      }
    }
  }
}
