import { getUserId } from './utils';
import { PUB_NEW_AVIS } from '../constants';
import { withFilter } from 'graphql-yoga';

export default {
  Query: {
    getAvis: async (_, {}, context) => {
      const avis = await context.prisma.avis.findMany();
      if (!avis) return new Error('Aucun avis associe');
      return avis;
    },
    getAvisUser: async (_, { userId }, context) => {
      const avis = await context.prisma.avis.findMany({
        where: { scored: { id: userId } }
      });
      if (!avis) return new Error('Aucun avis associe');
      return avis;
    }
  },
  Mutation: {
    createAvis: async (
      _,
      { scoredId, comment, score, offeringId },
      context
    ) => {
      try {
        const scorerId = getUserId(context);
        if (scorerId == scoredId) return false;

        const offering = await context.prisma.offering.findOne({
          where: { id: offeringId }
        });

        if (scorerId !== offering.authorId) return false;
        if (scoredId == offering.authorId) return false;

        const avis = await context.prisma.avis.create({
          data: {
            score,
            comment,
            scorer: { connect: { id: scorerId } },
            scored: { connect: { id: scoredId } },
            offering: { connect: { id: offeringId } }
          }
        });
        if (!avis) return false;

        const updated = await context.prisma.offering.update({
          where: { id: offeringId },
          data: {
            completed: true,
            completedBy: { connect: { id: scoredId } }
          }
        });
        if (!updated) return false;
        context.pubsub.publish(PUB_NEW_AVIS, { newAvis: avis });
        return true;
      } catch (error) {
        throw new Error('Creation de Avis impossible');
      }
    }
  },
  Subscription: {
    newAvis: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_AVIS),
        (payload, variables) => {
          console.log(payload.newAvis);
          return payload.newAvis.scoredId === variables.userId;
        }
      )
    }
  },
  Avis: {
    scorer: async (parent, __, { prisma }) => {
      const scorer = await prisma.user.findMany({
        where: { avisgave: { some: { id: parent.id } } }
      });
      return scorer[0];
    },
    scored: async (parent, __, { prisma }) => {
      const scored = await prisma.user.findMany({
        where: { avisreceived: { some: { id: parent.id } } }
      });
      return scored[0];
    },
    offering: async (parent, __, { prisma }) => {
      const offering = await prisma.offering.findMany({
        where: { avis: { some: { id: parent.id } } }
      });
      return offering[0];
    }
  }
  //TODO subscription avisSubscriptionResponse
};
