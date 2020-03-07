import { UserInputError } from 'apollo-server-express'

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
      return users
    }
  },
  Mutation: {
    enregistrement: async (parent, { nom, prenom, numero }, context, info) => {
      const user = await context.prisma.createUser({ nom, prenom, numero })

      return user
    }
  }
}
