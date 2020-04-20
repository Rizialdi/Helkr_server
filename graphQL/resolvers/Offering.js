import { getUserId } from './utils'

export default {
  Query: {
    offeringsUser: async (parent, { numero }, context, info) => {
      const offerings = await context.prisma.user.findOne({ where: { numero }}).offerings()
      return offerings
    },
    offerings: async (_, __, context) => {
      return context.prisma.offering.findMany()
    }
  },
  Mutation: {
    addOffering: async (_, { type, category, description }, context) => {
      const userId = getUserId(context)
      const offering = await context.prisma.offering.create({ data: { type, category, description, author: { connect: { id: userId } } }})
      return offering
    },
    updateOffering: async (_, { id, description }, context) => {
      const offering = await context.prisma.offering.update({ where: { id }, data: { description }})
      return offering
    }
  },
  Offering: {
    author: async (parent, _, { prisma }) => {
      const author = await prisma.offering.findOne({ where: { id: parent.id }}).author()
      return author
    }
  }
}
