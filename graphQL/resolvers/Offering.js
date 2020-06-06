import { getUserId } from '../../utils';

export default {
  Query: {
    offeringsUser: async (_, { numero }, context, __) => {
      const offerings = await context.prisma.utilisateur
        .findOne({ where: { numero } })
        .offerings();
      return offerings;
    },
    offerings: async (_, __, context) => {
      const offerings = await context.prisma.offering.findMany();
      return offerings;
    }
  },
  Mutation: {
    addOffering: async (
      _,
      { type, category, description, details },
      context
    ) => {
      const userId = getUserId(context);
      try {
        const offering = await context.prisma.offering.create({
          data: {
            type,
            category,
            description,
            details,
            author: { connect: { id: userId } }
          }
        });

        if (!offering) return false;
        return true;
      } catch (error) {
        throw new Error('creation de Offre impossible');
      }
    },
    updateOffering: async (_, { id, description }, context) => {
      try {
        const offering = await context.prisma.offering.update({
          where: { id },
          data: { description }
        });
        if (!offering) return false;
        return true;
      } catch (error) {
        throw new Error('Modification de Offre impossible');
      }
    },
    deleteOffering: async (_, { id }, context) => {
      const userId = getUserId(context);
      try {
        const suppressed = await context.prisma.offering.delete({
          where: { id }
        });
        if (!suppressed) return false;
        return true;
      } catch (error) {
        throw new Error('Suppresion de Offre impossible');
      }
    },
    completeOffering: async (_, { id, completedById }, context) => {
      const userId = getUserId(context);
      try {
        if (userId == completedById) return false;

        const offering = await context.prisma.offering.findOne({
          where: { id }
        });
        if (userId !== offering.authorId) return false;

        const updated = await context.prisma.offering.update({
          where: { id },
          data: {
            completed: true,
            completedBy: { connect: { id: completedById } }
          }
        });
        if (!updated) return false;
        return true;
      } catch (error) {
        throw new Error('Finition de Offre impossible');
      }
    }
  },

  Offering: {
    author: async (parent, __, { prisma }) => {
      const author = await prisma.utilisateur.findMany({
        where: { offerings: { some: { id: parent.id } } }
      });
      return author[0];
    },
    completedBy: async (parent, __, { prisma }) => {
      const completedBy = await prisma.utilisateur.findMany({
        where: { completedofferings: { some: { id: parent.id } } }
      });
      return completedBy[0];
    },
    avis: async (parent, __, { prisma }) => {
      const avis = prisma.avis.findMany({
        where: { offering: { id: parent.id } }
      });
      return avis;
    }
  }
};
