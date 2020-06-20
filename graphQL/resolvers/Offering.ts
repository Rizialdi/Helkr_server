import { getUserId } from '../../utils';
import { PUB_NEW_OFFERING, PUB_UPDATE_APPLIED_TO } from '../constants';
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
      const where = {
        AND: [
          {
            completed: { equals: false }
          },
          {
            candidates: { some: { id: { in: [userId] } } }
          }
        ]
      };

      try {
        const offerings = await context.prisma.offering.findMany({
          orderBy: { createdAt: 'desc' },
          where,
          include: { selectedCandidate: true }
        });

        if (!offerings) return [];

        const data = offerings.map((offering) => {
          const response = {
            id: offering.id,
            type: offering.type,
            createdAt: offering.createdAt,
            category: offering.category,
            description: offering.description
          };

          if (!offering.selectedCandidate) {
            return { ...response, status: 'en attente' };
          }

          if (offering.selectedCandidate.id === userId) {
            return { ...response, status: 'acceptée' };
          } else {
            return { ...response, status: 'refusée' };
          }
        });
        return data;
      } catch (error) {
        throw new Error(`Erreur fetching offering status ${error}`);
      }
    },
    myIncompleteOffering: async (_, __, context) => {
      const userId = getUserId(context);

      const where = {
        AND: [
          { completed: { equals: false } },
          {
            authorId: { equals: userId }
          },
          { candidates: { every: { id: { equals: null } } } }
        ]
      };

      try {
        const offerings = await context.prisma.offering.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          include: { candidates: true }
        });

        if (!offerings) return [];

        return offerings;
      } catch (error) {
        throw new Error(`Erreur fetching offering status ${error}`);
      }
    },
    myIncompleteOfferingCandidates: async (_, __, context) => {
      const userId = getUserId(context);

      const where = {
        AND: [
          {
            authorId: { equals: userId }
          },
          { candidates: { some: { NOT: { id: null } } } }
        ]
      };

      try {
        const offerings = await context.prisma.offering.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          include: { candidates: true }
        });

        if (!offerings) return [];

        const data = offerings.map((offering) => {
          const response = {
            id: offering.id,
            type: offering.type,
            createdAt: offering.createdAt,
            category: offering.category,
            description: offering.description
          };

          if (!offering.selectedCandidate) {
            return { ...response, status: 'en attente' };
          }

          if (offering.selectedCandidate) {
            return { ...response, status: 'confirmée' };
          }
        });

        return data;
      } catch (error) {
        throw new Error(`Erreur fetching offering status ${error}`);
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
    chooseCandidate: async (_, { id, candidateId }, context) => {
      const userId = getUserId(context);
      try {
        if (userId == candidateId) return false;

        const offering = await context.prisma.offering.findOne({
          where: { id },
          include: { selectedCandidate: true }
        });

        if (userId !== offering.authorId) return false;

        if (offering.selectedCandidate) return false;

        const updated = await context.prisma.offering.update({
          where: { id },
          data: {
            selectedCandidate: { connect: { id: candidateId } }
          },
          include: { candidates: { select: { id: true } } }
        });

        context.pubsub.publish(PUB_UPDATE_APPLIED_TO, {
          updated
        });

        return true;
      } catch (error) {
        throw new Error('Finition de Offre impossible');
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
    },
    updateAppliedTo: {
      resolve: ({ updated }, { userId }, context, info) => {
        let status = '';

        if (!updated) return { id: '', status };

        if (!updated.selectedCandidate) {
          status = 'en attente';
        }

        if (updated.selectedCandidateId === userId) {
          status = 'acceptée';
        } else {
          status = 'refusée';
        }

        return { id: updated.id, status };
      },
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(PUB_UPDATE_APPLIED_TO),
        ({ updated }, { userId }) => {
          const candidates = [];
          updated.candidates.map((candidate) => {
            candidates.push(candidate.id);
          });
          return candidates.includes(userId);
        }
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
