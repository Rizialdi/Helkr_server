import { withFilter } from 'graphql-yoga';
import { PUB_UPDATE_APPLIED_TO, PUB_NEW_OFFERING } from './constants';
import {
  objectType,
  extendType,
  stringArg,
  subscriptionField,
  core,
  scalarType
} from '@nexus/schema';
import { getUserId } from '../../utils';
import { utilisateur } from '@prisma/client';
import { GraphQLJSONObject } from 'graphql-type-json';

export const requiredStr = (opts: core.ScalarArgConfig<string>) => {
  return stringArg({ ...opts });
};

exports.JSONScalar = scalarType({
  name: 'JSON',
  asNexusMethod: 'json',
  serialize: GraphQLJSONObject.serialize,
  parseValue: GraphQLJSONObject.parseValue,
  parseLiteral: GraphQLJSONObject.parseLiteral
});

exports.Offering = objectType({
  name: 'offering',
  definition(t) {
    t.model.id();
    t.model.type();
    t.model.category();
    t.model.description();
    t.model.author({ type: 'utilisateur' });
    t.model.description();
    t.model.candidates({ type: 'utilisateur' });
    t.model.selectedCandidate({ type: 'utilisateur' });
    t.model.createdAt();
    t.field('details', {
      type: 'JSON',
      resolve: async (parent, __, ctx) => {
        return ctx.prisma.offering.findOne({
          where: { id: parent.id },
          select: { details: true }
        });
      }
    });
    t.model.avis();
  }
});

exports.OfferingWithCandidates = extendType({
  type: 'offering',
  definition(t) {
    t.string('status', { nullable: true });
  }
});

exports.QueryOfferings = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('offeringsUser', {
      type: 'offering',
      args: { numero: stringArg({ required: true }) },
      resolve: async (_, { numero }, { prisma }) => {
        const offerings = await prisma.utilisateur
          .findOne({ where: { numero } })
          .offerings();
        return offerings;
      }
    });
    t.list.field('incompleteOfferings', {
      type: 'offering',
      args: { filters: requiredStr({ list: true }) },
      resolve: async (_, { filters }, ctx) => {
        const userId = getUserId(ctx);

        if (!filters) return [];
        const where = filters
          ? {
              AND: [
                {
                  completed: { equals: false }
                },
                {
                  type: {
                    in: filters as string[]
                  }
                },
                {
                  candidates: { every: { id: { notIn: [userId] } } }
                }
              ]
            }
          : {};

        const offerings = await ctx.prisma.offering.findMany({
          orderBy: { createdAt: 'desc' },
          where
        });
        if (!offerings) return [];
        return offerings;
      }
    });
    t.field('offeringById', {
      type: 'offering',
      args: { id: stringArg({ required: true }) },
      resolve: async (_, { id }, ctx) => {
        try {
          const offering = await ctx.prisma.offering.findOne({
            where: { id },
            include: {
              candidates: true
            }
          });
          return offering;
        } catch (error) {
          throw new Error('Impossible de trouver cette offre');
        }
      }
    });
    t.list.field('isCandidateTo', {
      type: 'offering',
      resolve: async (_, __, ctx) => {
        const userId = getUserId(ctx);

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
          const offerings = await ctx.prisma.offering.findMany({
            orderBy: { createdAt: 'desc' },
            where,
            include: { selectedCandidate: true }
          });

          if (!offerings) return [];

          const data = offerings.map(offering => {
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
      }
    });
    t.list.field('myIncompleteOffering', {
      type: 'offering',
      resolve: async (_, __, ctx) => {
        const userId = getUserId(ctx);

        const where = {
          AND: [
            { completed: { equals: false } },
            {
              authorId: { equals: userId }
            },
            { candidates: { every: { id: { equals: undefined || '' } } } }
          ]
        };

        try {
          const offerings = await ctx.prisma.offering.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { candidates: true }
          });

          if (!offerings) return [];

          return offerings;
        } catch (error) {
          throw new Error(`Erreur fetching offering status ${error}`);
        }
      }
    });
    t.list.field('myIncompleteOfferingWithCandidates', {
      type: 'offering',
      resolve: async (_, __, ctx) => {
        const userId = getUserId(ctx);

        const where = {
          AND: [
            {
              authorId: { equals: userId }
            },
            { candidates: { some: { NOT: { id: undefined || '' } } } }
          ]
        };

        try {
          const offerings = await ctx.prisma.offering.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
              candidates: true
            }
          });

          if (!offerings) return [];

          const data = offerings.map(offering => {
            if (!offering.selectedCandidateId) {
              return { ...offering, status: 'en attente' };
            }

            if (offering.selectedCandidateId && !offering.completed) {
              return { ...offering, status: 'validée' };
            }

            if (offering.selectedCandidateId && offering.completed) {
              return { ...offering, status: 'terminée' };
            }
            return { ...offering, status: '' };
          });
          return offerings;
        } catch (error) {
          throw new Error(`Erreur fetching offering status ${error}`);
        }
      }
    });
  }
});

exports.MutationOfferings = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addOffering', {
      type: 'Boolean',
      args: {
        type: stringArg({ required: true }),
        category: stringArg({ required: true }),
        description: stringArg({ required: true }),
        details: stringArg({ required: true })
      },
      resolve: async (_, { type, category, description, details }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const addedOffering = await ctx.prisma.offering.create({
            data: {
              type,
              category,
              description,
              details,
              author: { connect: { id: userId } }
            }
          });

          if (!addedOffering) return false;
          ctx.pubsub.publish(PUB_NEW_OFFERING, {
            addedOffering
          });
          return true;
        } catch (error) {
          throw new Error('creation de Offre impossible');
        }
      }
    });
    t.field('updateOffering', {
      type: 'Boolean',
      args: {
        id: stringArg({ required: true }),
        description: stringArg({ required: true })
      },
      resolve: async (_, { id, description }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const offering = await ctx.prisma.offering.update({
            where: { id },
            data: { description }
          });
          if (!offering) return false;
          if (offering.authorId != userId) return false;
          return true;
        } catch (error) {
          throw new Error('Modification de Offre impossible');
        }
      }
    });
    t.field('candidateToOffering', {
      type: 'CandidateToOfferingSuccess',
      args: {
        id: stringArg({ required: true })
      },
      resolve: async (_, { id }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const intermediate = await ctx.prisma.offering.findOne({
            where: { id }
          });

          if (intermediate && userId === intermediate.authorId)
            return { success: false };

          const offering = await ctx.prisma.offering.update({
            where: { id },
            data: { candidates: { connect: { id: userId } } }
          });

          if (!intermediate || !offering) return { success: false };

          return { success: true };
        } catch (error) {
          throw new Error('Candidature a Offre impossible');
        }
      }
    });
    t.field('deleteOffering', {
      type: 'Boolean',
      args: {
        id: stringArg({ required: true })
      },
      resolve: async (_, { id }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const offering = await ctx.prisma.offering.findOne({ where: { id } });
          if (offering && userId != offering.authorId) return false;

          const suppressed = await ctx.prisma.offering.delete({
            where: { id }
          });
          if (!suppressed) return false;
          return true;
        } catch (error) {
          throw new Error('Suppresion de Offre impossible');
        }
      }
    });
    t.field('chooseCandidate', {
      type: 'Boolean',
      args: {
        id: stringArg({ required: true }),
        candidateId: stringArg({ required: true })
      },
      resolve: async (_, { id, candidateId }, ctx) => {
        const userId = getUserId(ctx);
        try {
          if (userId == candidateId) return false;

          const offering = await ctx.prisma.offering.findOne({
            where: { id },
            include: { selectedCandidate: true }
          });

          if (offering && userId !== offering.authorId) return false;

          if (offering && offering.selectedCandidate) return false;

          const updated = await ctx.prisma.offering.update({
            where: { id },
            data: {
              selectedCandidate: { connect: { id: candidateId } }
            },
            include: { candidates: { select: { id: true } } }
          });

          ctx.pubsub.publish(PUB_UPDATE_APPLIED_TO, {
            updated
          });

          return true;
        } catch (error) {
          throw new Error('Finition de Offre impossible');
        }
      }
    });
    t.field('completeOffering', {
      type: 'Boolean',
      args: {
        id: stringArg({ required: true }),
        completedById: stringArg({ required: true })
      },
      resolve: async (_, { id, completedById }, ctx) => {
        const userId = getUserId(ctx);
        try {
          if (userId == completedById) return false;

          const offering = await ctx.prisma.offering.findOne({
            where: { id }
          });
          if (offering && userId !== offering.authorId) return false;

          const updated = await ctx.prisma.offering.update({
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
    });
  }
});

exports.SubscriptionOffering = subscriptionField('onOfferingAdded', {
  type: 'offering',
  args: { tags: requiredStr({ list: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_OFFERING),
    (payload, variables) => {
      return variables.tags.includes(payload.addedOffering.type);
    }
  ),
  resolve: payload => {
    return payload.addedOffering;
  }
});

exports.SubscriptionAppliedOffering = subscriptionField('updateAppliedTo', {
  type: 'updateAppliedToType',
  args: { userId: stringArg({ required: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_UPDATE_APPLIED_TO),
    ({ updated }, { userId }) => {
      const candidates: string[] = [];
      updated.candidates.map((candidate: utilisateur) => {
        candidates.push(candidate.id);
      });
      return candidates.includes(userId);
    }
  ),
  resolve: ({ updated }, { userId }, ctx) => {
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
  }
});

exports.updateAppliedToType = objectType({
  name: 'updateAppliedToType',
  definition(t) {
    t.string('id'), t.string('status');
  }
});

exports.CandidateToOfferingSuccess = objectType({
  name: 'CandidateToOfferingSuccess',
  definition(t) {
    t.boolean('success');
  }
});
