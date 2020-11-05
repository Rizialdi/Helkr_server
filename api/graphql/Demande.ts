import { withFilter } from 'graphql-yoga';
import { PUB_NEW_DEMANDE } from './constants';
import {
  objectType,
  extendType,
  stringArg,
  subscriptionField
} from '@nexus/schema';
import { getUserId } from '../../utils';

exports.Demande = objectType({
  name: 'demande',
  definition(t) {
    t.model.id();
    t.model.sentById();
    t.model.receivedById();
    t.model.message();
    t.model.createdAt();
    t.field('sentBy', {
      nullable: true,
      type: 'utilisateur',
      resolve: async (parent, {}, ctx) => {
        if (!parent.sentById) return null;

        const user = await ctx.prisma.utilisateur.findOne({
          where: { id: parent.sentById }
        });
        return user;
      }
    });
  }
});

exports.QueryDemandes = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('demandes', {
      type: 'demande',
      resolve: async (_, __, { prisma }) => {
        const demandes = await prisma.demande.findMany({});
        return demandes;
      }
    });
    t.list.field('demandesrecues', {
      type: 'demande',
      resolve: async (_, __, ctx) => {
        const userId = getUserId(ctx);

        const demandes = await ctx.prisma.demande.findMany({
          where: { receivedById: userId },
          include: { sentBy: { select: { nom: true, prenom: true } } }
        });

        return demandes;
      }
    });
    t.list.field('demandesenvoyees', {
      type: 'demande',
      resolve: async (_, __, ctx) => {
        const userId = getUserId(ctx);

        const demandes = await ctx.prisma.demande.findMany({
          where: { sentById: userId }
        });

        return demandes;
      }
    });
  }
});

exports.MutationDemandes = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDemande', {
      type: 'Boolean',
      args: {
        message: stringArg({ nullable: false }),
        recipient: stringArg({ nullable: false })
      },
      resolve: async (_, { recipient, message }, ctx) => {
        const sentBy = getUserId(ctx);
        if (sentBy === recipient) return false;

        const pushToken = await ctx.prisma.notificationstoken.findOne({
          where: { userid: recipient },
          select: { token: true }
        });

        const SendPushNotificationToRecipient = async () => {
          pushToken &&
            pushToken.token &&
            ctx.sendPushNotification(pushToken.token, [
              'Nouvelle demande',
              'Vous avez reçu une nouvelle demande 🚀.',
              { screenToRedirect: 'Demandes' }
            ]);
        };

        try {
          const demande = recipient
            ? await ctx.prisma.demande.create({
                data: {
                  message,
                  sentBy: { connect: { id: sentBy } },
                  receivedBy: { connect: { id: recipient } }
                }
              })
            : null;

          if (!demande) return false;

          SendPushNotificationToRecipient();
          ctx.pubsub.publish(PUB_NEW_DEMANDE, {
            newDemande: demande
          });

          return true;
        } catch (error) {
          throw new Error('La creation de la demande a echoue');
        }
      }
    });
  }
});

// TODO A tester cette subscription
exports.SubscriptionDemande = subscriptionField('newDemande', {
  type: 'demande',
  args: { recipientId: stringArg({ required: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_DEMANDE),
    (payload, variables) => {
      return variables.recipientId.includes(payload.newDemande.receivedById);
    }
  ),
  resolve: payload => {
    return payload.newDemande;
  }
});
