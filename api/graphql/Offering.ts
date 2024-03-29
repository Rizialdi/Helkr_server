import { withFilter } from 'graphql-yoga';
import {
  PUB_UPDATE_APPLIED_TO,
  PUB_NEW_OFFERING,
  PUB_SELECTED_EVENT_DAY
} from './constants';
import {
  objectType,
  extendType,
  stringArg,
  subscriptionField,
  core,
  scalarType,
  intArg
} from '@nexus/schema';
import { getUserId } from '../../utils';
import { utilisateur } from '@prisma/client';
import { GraphQLJSONObject } from 'graphql-type-json';

export const requiredStr = (
  opts: core.ScalarArgConfig<string>
): core.NexusArgDef<'String'> => {
  return stringArg({ ...opts, required: true });
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
    t.model.referenceid({ alias: 'referenceId' });
    t.model.type();
    t.model.category();
    t.model.description();
    t.model.author({ type: 'utilisateur' });
    t.model.description();
    t.model.candidates({ type: 'utilisateur' });
    t.model.selectedCandidate({ type: 'utilisateur' });
    t.model.createdAt();
    t.model.updatedAt();
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
    t.model.preferreddays();
    t.model.eventday();
    t.model.completed();
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
    t.list.field('allOfferings', {
      type: 'offering',
      args: { filters: requiredStr({ list: true }) },

      resolve: async (_, { filters }, { prisma }) => {
        const where = filters
          ? {
              type: {
                in: filters as string[]
              }
            }
          : {};
        const offerings = await prisma.offering.findMany({ where });
        return offerings;
      }
    });
    t.field('incompleteOfferings', {
      type: 'OfferingAugmented',
      args: {
        take: intArg({ required: true }),
        lastCursorId: stringArg({ required: false }),
        filters: requiredStr({ list: true })
      },
      resolve: async (_, { take, lastCursorId, filters }, ctx) => {
        const userId = getUserId(ctx);

        if (!filters) {
          return {
            hasNext: false,
            endCursor: '',
            offerings: null
          };
        }

        const userInfos = await ctx.prisma.utilisateur.findOne({
          where: { id: userId },
          select: { address: true }
        });

        const userAddress =
          userInfos && userInfos.address ? userInfos.address : '';

        const where = {
          AND: [
            {
              completed: { equals: false }
            },
            {
              referenceid: {
                in: filters as string[]
              }
            },
            {
              candidates: {
                every: { id: { notIn: [userId] } }
              }
            },
            {
              author: {
                AND: [
                  {
                    id: { notIn: [userId] }
                  },
                  { address: { equals: userAddress } }
                ]
              }
            }
          ]
        };

        const offerings = lastCursorId
          ? await ctx.prisma.offering.findMany({
              orderBy: { createdAt: 'desc' },
              where,
              skip: 1,
              take: take + 1,
              cursor: { id: lastCursorId }
            })
          : await ctx.prisma.offering.findMany({
              orderBy: { createdAt: 'desc' },
              where,
              take: take + 1
            });

        const lastIndexId =
          offerings && offerings.length > take
            ? offerings[offerings.length - 2].id
            : offerings.length <= take
            ? offerings[offerings.length - 1].id
            : '';

        return {
          hasNext: offerings.length > take,
          endCursor: lastIndexId,
          offerings:
            offerings && offerings.length > take
              ? offerings.slice(0, -1)
              : offerings.length <= take
              ? offerings
              : null
        };
      }
    });
    t.field('offeringById', {
      type: 'offering',
      args: { id: stringArg({ required: true }) },
      resolve: async (_, { id }, ctx) => {
        try {
          const offering = await ctx.prisma.offering.findMany({
            where: { id },
            include: {
              candidates: true
            }
          });
          return offering[0];
        } catch (error) {
          throw new Error('Impossible de trouver cette offre');
        }
      }
    });
    t.field('isCandidateTo', {
      type: 'OfferingAugmented',
      args: {
        take: intArg({ required: true }),
        lastCursorId: stringArg({ required: false })
      },
      resolve: async (_, { take, lastCursorId }, ctx) => {
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
          const offerings = lastCursorId
            ? await ctx.prisma.offering.findMany({
                orderBy: { createdAt: 'desc' },
                where,
                skip: 1,
                take: take + 1,
                cursor: { id: lastCursorId },
                include: { selectedCandidate: true }
              })
            : await ctx.prisma.offering.findMany({
                orderBy: { createdAt: 'desc' },
                where,
                take: take + 1,
                include: { selectedCandidate: true }
              });

          const lastIndexId =
            offerings && offerings.length > take
              ? offerings[offerings.length - 2].id
              : offerings.length <= take
              ? offerings[offerings.length - 1].id
              : '';

          const data = offerings.map(offering => {
            if (!offering.selectedCandidate) {
              return { ...offering, status: 'en attente' };
            }

            if (offering.selectedCandidate.id && offering.completed)
              return { ...offering, status: 'terminée' };

            if (offering.selectedCandidate.id === userId) {
              return { ...offering, status: 'acceptée' };
            } else {
              return { ...offering, status: 'refusée' };
            }
          });

          return {
            hasNext: offerings.length > take,
            endCursor: lastIndexId,
            offerings:
              data && data.length > take
                ? data.slice(0, -1)
                : data.length <= take
                ? data
                : null
          };
        } catch (error) {
          throw new Error(`Erreur fetching offering status ${error}`);
        }
      }
    });
    t.field('myIncompleteOffering', {
      type: 'OfferingAugmented',
      args: {
        take: intArg({ required: true }),
        lastCursorId: stringArg({ required: false })
      },
      resolve: async (_, { take, lastCursorId }, ctx) => {
        const userId = getUserId(ctx);

        const where = {
          AND: [
            { completed: { equals: false } },
            {
              authorId: { equals: userId }
            },
            {
              candidates: {
                every: { id: { equals: undefined || '' } }
              }
            }
          ]
        };

        try {
          const offerings = lastCursorId
            ? await ctx.prisma.offering.findMany({
                where,
                skip: 1,
                take: take + 1,
                cursor: { id: lastCursorId },
                orderBy: { createdAt: 'desc' },
                include: { candidates: true }
              })
            : await ctx.prisma.offering.findMany({
                where,
                take: take + 1,
                orderBy: { createdAt: 'desc' },
                include: { candidates: true }
              });

          const lastIndexId =
            offerings && offerings.length > take
              ? offerings[offerings.length - 2].id
              : offerings.length <= take
              ? offerings[offerings.length - 1].id
              : '';

          return {
            hasNext: offerings.length > take,
            endCursor: lastIndexId,
            offerings:
              offerings && offerings.length > take
                ? offerings.slice(0, -1)
                : offerings.length <= take
                ? offerings
                : null
          };
        } catch (error) {
          throw new Error(`Erreur fetching offering status ${error}`);
        }
      }
    });
    t.field('myIncompleteOfferingWithCandidates', {
      type: 'OfferingAugmented',
      args: {
        take: intArg({ required: true }),
        lastCursorId: stringArg({ required: false })
      },
      resolve: async (_, { take, lastCursorId }, ctx) => {
        const userId = getUserId(ctx);

        const where = {
          AND: [
            {
              authorId: { equals: userId }
            },
            {
              candidates: {
                some: { NOT: { id: undefined || '' } }
              }
            }
          ]
        };

        try {
          const offerings = lastCursorId
            ? await ctx.prisma.offering.findMany({
                where,
                skip: 1,
                take: take + 1,
                cursor: { id: lastCursorId },
                orderBy: { createdAt: 'desc' },
                include: {
                  candidates: true
                }
              })
            : await ctx.prisma.offering.findMany({
                where,
                take: take + 1,
                orderBy: { createdAt: 'desc' },
                include: {
                  candidates: true
                }
              });

          const lastIndexId =
            offerings && offerings.length > take
              ? offerings[offerings.length - 2].id
              : offerings.length <= take
              ? offerings[offerings.length - 1].id
              : '';

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

          return {
            hasNext: offerings.length > take,
            endCursor: lastIndexId,
            offerings:
              data && data.length > take
                ? data.slice(0, -1)
                : data.length <= take
                ? data
                : null
          };
        } catch (error) {
          throw new Error(`Erreur fetching offering status ${error}`);
        }
      }
    });
    t.field('propositionToOfferingDetails', {
      type: 'propositionToOffering',
      args: {
        userId: stringArg({ required: true }),
        offeringId: stringArg({ required: true })
      },
      resolve: async (_, { userId, offeringId }, ctx) => {
        try {
          const proposition = await ctx.prisma.propositiontooffering.findOne({
            where: {
              offeringId_utilisateurId: { offeringId, utilisateurId: userId }
            }
          });

          const user = await ctx.prisma.utilisateur.findOne({
            where: { id: userId }
          });

          if (!user || !proposition) {
            return {
              message: '',
              priceRange: '',
              candidateUsername: '',
              descriptionPrestataire: ''
            };
          }

          return {
            message: proposition.message,
            priceRange: proposition.priceRange,
            candidateUsername: `${user.prenom} ${user.nom.charAt(0)}.`,
            descriptionPrestataire: user.description
          };
        } catch (error) {
          return {
            message: '',
            priceRange: '',
            candidateUsername: '',
            descriptionPrestataire: ''
          };
        }
      }
    });
  }
});

exports.MutationOfferings = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addOffering', {
      type: 'JSON',
      args: {
        type: stringArg({ required: true }),
        category: stringArg({ required: true }),
        description: stringArg({ required: true }),
        details: stringArg({ required: true }),
        referenceId: stringArg({ required: true })
      },
      resolve: async (
        _,
        { type, category, description, details, referenceId },
        ctx
      ) => {
        try {
          const userId = getUserId(ctx);
          // look up the user address / location / city
          const user = await ctx.prisma.utilisateur.findOne({
            where: { id: userId },
            select: { address: true }
          });

          const userLocation = user && user.address ? user.address : '';

          if (!userLocation)
            return {
              status: false,
              message:
                "Votre adresse n'est pas renseignée. Veuillez la renseigner et réessayer"
            };

          const giggersAround = await ctx.prisma.tags.findMany({
            where: {
              AND: {
                tags: { contains: referenceId },
                utilisateur: { address: { contains: userLocation } }
              }
            },
            include: {
              utilisateur: {
                include: { notificationstoken: { select: { token: true } } }
              }
            }
          });

          if (!(giggersAround.length > 0))
            return {
              status: false,
              message:
                "Il n'y a jusqu'a présent, aucun prestataire pour cette catégorie dans votre secteur. Veuillez réessayer plus tard."
            };

          const addedOffering = await ctx.prisma.offering.create({
            data: {
              type,
              details,
              category,
              description,
              referenceid: referenceId,
              author: { connect: { id: userId } }
            }
          });

          giggersAround &&
            giggersAround.map(item => {
              if (
                !item ||
                !item.utilisateur ||
                !item.utilisateur.notificationstoken ||
                !item.utilisateur.notificationstoken.token ||
                item.utilisateur.id === userId
              )
                return;

              const token = item.utilisateur.notificationstoken.token;
              ctx.sendPushNotification(token, [
                addedOffering.type,
                'Une offre correspondant à vos critères a été ajouté',
                { screenToRedirect: 'Offres' }
              ]);
            });

          if (!addedOffering)
            return {
              status: false,
              message:
                "Une erreur s'est produite lors de la création de la mission. Veuillez réessayer plus tard."
            };
          ctx.pubsub.publish(PUB_NEW_OFFERING, {
            addedOffering
          });
          return { status: true, message: '' };
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
    t.field('chooseEventDay', {
      type: 'Boolean',
      args: {
        id: stringArg({ required: true }),
        timestamp: stringArg({ required: true })
      },
      resolve: async (_, { id, timestamp }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const data = await ctx.prisma.offering.findOne({
            where: { id },
            select: { selectedCandidate: true, authorId: true }
          });
          const condition =
            data &&
            data.selectedCandidate &&
            data.selectedCandidate.id != userId;

          if (condition) return false;

          const offering = await ctx.prisma.offering.update({
            where: { id },
            data: { eventday: timestamp }
          });
          if (!offering) return false;

          if (data && data.authorId) {
            const notificationToken = await ctx.prisma.notificationstoken.findOne(
              {
                where: { userid: data.authorId },
                select: { token: true }
              }
            );

            notificationToken &&
              notificationToken.token &&
              ctx.sendPushNotification(notificationToken.token, [
                'Mise à jour sur une offre',
                'Le prestataire vient de choisir une date de rendez-vous',
                { screenToRedirect: 'Candidats', offeringId: offering.id }
              ]);
          }

          ctx.pubsub.publish(PUB_SELECTED_EVENT_DAY, {
            updated: offering
          });
          return true;
        } catch (error) {
          throw new Error('Choix du jour impossible');
        }
      }
    });
    t.field('candidateToOffering', {
      type: 'CandidateToOfferingSuccess',
      args: {
        id: stringArg({ required: true }),
        message: stringArg({ required: true }),
        priceRange: stringArg({ required: true })
      },
      resolve: async (_, { id, message, priceRange }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const intermediate = await ctx.prisma.offering.findOne({
            where: { id }
          });

          if (intermediate && userId === intermediate.authorId)
            return { success: false };

          if (!intermediate) return { success: false };

          const proposition = await ctx.prisma.propositiontooffering.create({
            data: {
              message,
              priceRange,
              utilisateur: { connect: { id: userId } },
              offering: { connect: { id: intermediate.id } }
            }
          });

          const offering = await ctx.prisma.offering.update({
            where: { id },
            data: {
              candidates: { connect: { id: userId } },
              propositiontooffering: {
                connect: {
                  offeringId_utilisateurId: {
                    offeringId: proposition.offeringId,
                    utilisateurId: proposition.utilisateurId
                  }
                }
              }
            }
          });

          if (!intermediate || !offering) return { success: false };

          // Notify the author of a new candidate
          const notificationToken = await ctx.prisma.notificationstoken.findOne(
            {
              where: { userid: intermediate.authorId },
              select: { token: true }
            }
          );

          notificationToken &&
            notificationToken.token &&
            ctx.sendPushNotification(notificationToken.token, [
              'Mise à jour sur une offre',
              'Un candidat vient de postuler à une de vos offres. Ne perdez plus de temps ⏱️.',
              { screenToRedirect: 'Candidats', offeringId: offering.id }
            ]);

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
          const offering = await ctx.prisma.offering.findOne({
            where: { id }
          });
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
        candidateId: stringArg({ required: true }),
        preferreddays: requiredStr({ list: true })
      },
      resolve: async (_, { id, candidateId, preferreddays }, ctx) => {
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
              selectedCandidate: { connect: { id: candidateId } },
              preferreddays: { set: preferreddays }
            },
            include: { candidates: { select: { id: true } } }
          });

          if (!updated) return false;

          if (offering && offering.authorId) {
            // Notification for selected users
            const notificationToken = await ctx.prisma.notificationstoken.findOne(
              {
                where: {
                  userid: candidateId
                },
                select: { token: true }
              }
            );

            notificationToken &&
              notificationToken.token &&
              ctx.sendPushNotification(notificationToken.token, [
                'Mise à jour sur une candidature',
                'Vous avez été choisi pour une mission',
                {
                  screenToRedirect: 'Postulées',
                  offeringId: offering.id
                }
              ]);

            // Notification for non-selected users
            updated.candidates
              .filter(i => i.id != candidateId)
              .map(async candidate => {
                const notificationToken = await ctx.prisma.notificationstoken.findOne(
                  {
                    where: {
                      userid: candidate.id
                    },
                    select: { token: true }
                  }
                );

                notificationToken &&
                  notificationToken.token &&
                  ctx.sendPushNotification(notificationToken.token, [
                    'Mise à jour sur une candidature',
                    'Vous avez été refusé pour une mission',
                    {
                      screenToRedirect: 'Postulées',
                      offeringId: offering.id
                    }
                  ]);
              });
          }

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

exports.SubscriptionUpdateEventDay = subscriptionField('updatedEventDay', {
  type: 'updateSelectedEventDay',
  args: { userId: stringArg({ required: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_SELECTED_EVENT_DAY),
    ({ updated }, { userId }) => {
      return updated.authorId === userId;
    }
  ),
  resolve: async ({ updated }, __) => {
    const payload = { offeringId: updated.id, eventday: updated.eventday };
    return payload;
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
  resolve: ({ updated }, { userId }) => {
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

exports.updateSelectedEventDay = objectType({
  name: 'updateSelectedEventDay',
  definition(t) {
    t.string('offeringId'), t.string('eventday');
  }
});

exports.CandidateToOfferingSuccess = objectType({
  name: 'CandidateToOfferingSuccess',
  definition(t) {
    t.boolean('success');
  }
});

exports.PropositionToOffering = objectType({
  name: 'propositionToOffering',
  definition(t) {
    t.string('message');
    t.string('priceRange');
    t.string('candidateUsername');
    t.string('descriptionPrestataire', { nullable: true });
  }
});

exports.OfferingAugmented = objectType({
  name: 'OfferingAugmented',
  definition(t) {
    t.boolean('hasNext');
    t.string('endCursor');
    t.list.field('offerings', { type: 'offering', nullable: true });
  }
});
