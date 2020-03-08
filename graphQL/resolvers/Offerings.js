import { getUserId } from './utils'

export default {
  Query: {
    offeringsUser: async (parent, { numero }, context, info) => {
      const user = await context.prisma.user({ numero })
      console.log(user.id)
      return context.prisma.offering({ author: user.id })
    },
    offerings: async (parent, args, context, info) => {
      return context.prisma.offerings()
    }
  },
  Mutation: {
    ajouter: async (parent, { type, category, description }, context, info) => {
      const userId = getUserId(context)
      const offerings = await context.prisma.createOffering({ type, category, description, author: { connect: { id: userId } } })
      return offerings
    },
    modifier: async (parent, { id, description }, context, info) => {
      const offering = await context.prisma.offering({ id })
      return offering
    }
  },
  Offering: {
    author: async (parent, args, { prisma }, info) => {
      const author = await prisma.offering({ id: parent.id }).author()
      return author
    }
  }
}
