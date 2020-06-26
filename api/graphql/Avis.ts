import { PUB_NEW_AVIS } from './constants';
import {
  objectType,
  extendType,
  stringArg,
  intArg,
  subscriptionField
} from '@nexus/schema';
import { getUserId } from '../../utils';
import { withFilter } from 'graphql-yoga';

exports.Avis = objectType({
  name: 'avis',
  definition(t) {
    t.model.id();
    t.model.comment();
    t.model.createdAt();
    t.model.scorer();
    t.model.scored();
    t.model.score();
    t.model.offering();
  }
});

exports.QueryAvis = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getAvisUser', {
      type: 'avis',
      args: { userId: stringArg({ required: true }) },
      resolve: async (_, { userId }, { prisma }) => {
        const avis = await prisma.avis.findMany({
          where: { scored: { id: userId } }
        });
        return avis;
      }
    });
  }
});

exports.MutationAvis = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAvis', {
      type: 'Boolean',
      args: {
        scoredId: stringArg({ required: true }),
        comment: stringArg({ required: true }),
        score: intArg({ required: true }),
        offeringId: stringArg({ required: true })
      },
      resolve: async (_, { scoredId, comment, score, offeringId }, ctx) => {
        try {
          const scorerId = getUserId(ctx);
          if (scorerId == scoredId) return false;

          const offering = await ctx.prisma.offering.findOne({
            where: { id: offeringId }
          });

          if (offering && scorerId !== offering.authorId) return false;
          if (offering && scoredId == offering.authorId) return false;

          const avis = await ctx.prisma.avis.create({
            data: {
              score,
              comment,
              scorer: { connect: { id: scorerId } },
              scored: { connect: { id: scoredId } },
              offering: { connect: { id: offeringId } }
            }
          });
          if (!avis) return false;

          const updated = await ctx.prisma.offering.update({
            where: { id: offeringId },
            data: {
              completed: true,
              completedBy: { connect: { id: scoredId } }
            }
          });
          if (!updated) return false;
          ctx.pubsub.publish(PUB_NEW_AVIS, { newAvis: avis });
          return true;
        } catch (error) {
          throw new Error('Creation de Avis impossible');
        }
      }
    });
  }
});

exports.SubscriptionAvis = subscriptionField('newAvis', {
  type: 'avis',
  args: { userId: stringArg({ required: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_AVIS),
    (payload, variables) => {
      return payload.newAvis.scoredId === variables.userId;
    }
  ),
  resolve: payload => {
    return payload.newAvis;
  }
});
