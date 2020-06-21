import { PUB_NEW_AVIS } from './constants';
import { objectType, extendType } from '@nexus/schema';
import { getUserId } from '../../utils';
import { type } from 'os';

exports.Avis = objectType({
  name: 'Avis',
  definition(t) {
    t.string('id');
    t.int('score', { nullable: true });
    t.field('scorer', {
      type: 'User',
      nullable: false,
      description: 'The author of an offering'
    });
    t.field('scored', {
      type: 'User',
      nullable: false,
      description: 'The user who completed an offering'
    });
    t.string('comment', {
      nullable: false,
      description: 'Sentence describing how the service was'
    });
    t.string('createdAt');
    t.field('offering', {
      type: 'Offering',
      nullable: false,
      description: 'Offering whose a mark is attributed'
    });
  }
});

exports.Query = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getAvis', {
      type: 'Avis',
      resolve: async (_, __, ctx) => {
        const avis = await ctx.db.avis.findMany();
        if (!avis) return new Error('Aucun avis associe');
        return avis;
      }
    });
    t.list.field('getAvisUser', {
      type: 'Avis',
      args: { userId: 'String' },
      resolve: async (_, { userId }, ctx) => {
        const avis = await ctx.db.avis.findMany({
          where: { scored: { id: userId } }
        });
        if (!avis) return new Error('Aucun avis associe');
        return avis;
      }
    });
  }
});

exports.Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAvis', {
      type: 'Boolean',
      args: {
        scoredId: 'String',
        comment: 'String',
        score: 'Int',
        offeringId: 'String'
      },
      resolve: async (_, { scoredId, comment, score, offeringId }, ctx) => {
        try {
          const scorerId = getUserId(ctx);
          if (scorerId == scoredId) return false;

          const offering = await ctx.db.offering.findOne({
            where: { id: offeringId }
          });

          if (scorerId !== offering.authorId) return false;
          if (scoredId == offering.authorId) return false;

          const avis = await ctx.db.avis.create({
            data: {
              score,
              comment,
              scorer: { connect: { id: scorerId } },
              scored: { connect: { id: scoredId } },
              offering: { connect: { id: offeringId } }
            }
          });
          if (!avis) return false;

          const updated = await ctx.db.offering.update({
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
