import { getUserId } from '../../utils';
import { PUB_NEW_OFFERING } from '../constants';
import { withFilter } from 'graphql-yoga';

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
    },
    incompleteOfferings: async (_, { filters }, context) => {
      const userId = getUserId(context);
      const where = filters
        ? {
            AND: [
              {
                completed: { equals: false }
              },
              {
                type: {
                  in: filters
                }
              },
              {
                candidates: { every: { id: { notIn: [userId] } } }
              }
            ]
          }
        : {};

      if (!filters) return null;
      const offerings = await context.prisma.offering.findMany({
        orderBy: { createdAt: 'desc' },
        where
      });
      if (!offerings) return null;
      return offerings;
    },
    offeringById: async (_, { id }, context) => {
      const offering = await context.prisma.offering.findOne({
        where: { id }
      });
      if (!offering) return null;
      return offering;
    },
    isCandidateTo: async (_, __, context) => {
      const userId = getUserId(context);
      try {
        const offering = await context.prisma.offering.findMany({
          where: {}
        });

        if (!offering) return null;

        return offering;
      } catch (error) {
        console.log(error);

        throw new Error('Retrait impossible');
      }
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
        context.pubsub.publish(PUB_NEW_OFFERING, {
          newOffering: {
            id: offering.id,
            type: offering.type,
            category: offering.category,
            description: offering.description,
            createdAt: offering.createdAt
          }
        });
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
    // TODo add a safe-guard to prevent a creator to
    // apply to its offer. Make it on the front-end (no apply button)
    candidateToOffering: async (_, { id }, context) => {
      const userId = getUserId(context);
      try {
        const intermediate = await context.prisma.offering.findOne({
          where: { id }
        });

        if (userId === intermediate.authorId) return { success: false };

        const offering = await context.prisma.offering.update({
          where: { id },
          data: { candidates: { connect: { id: userId } } }
        });

        if (!intermediate || !offering) return { success: false };

        return { success: true };
      } catch (error) {
        throw new Error('Candidature a Offre impossible');
      }
    },
    deleteOffering: async (_, { id }, context) => {
      const userId = getUserId(context);
      try {
        // const offre = await context.prisma.findOne({ where: { id } });

        // if (userId != offre.authorId) return false;

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
  Subscription: {
    newOffering: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_OFFERING),
        (payload, variables) =>
          variables.tags.includes(payload.newOffering.type)
      )
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
    },
    candidates: async (parent, __, { prisma }) => {
      const avis = prisma.utilisateur.findMany({
        where: { appliedTo: { some: { id: parent.id } } }
      });
      return avis;
    }
  }
};
