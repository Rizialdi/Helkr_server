import { withFilter } from 'graphql-yoga';
import { PUB_NEW_MESSAGE } from './constants';
import {
  objectType,
  extendType,
  stringArg,
  subscriptionField
} from '@nexus/schema';
import { getUserId } from '../../utils';

exports.Message = objectType({
  name: 'message',
  definition(t) {
    t.model.id();
    t.model.sentById();
    t.model.text();
    t.model.createdAt({ alias: 'date' });
    t.model.channel();
  }
});

exports.MessagesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('messages', {
      type: 'message',
      resolve: async (_, __, { prisma }) => {
        return prisma.message.findMany();
      }
    });
  }
});

exports.MessagesMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createMessage', {
      type: 'Boolean',
      args: {
        channelId: stringArg({ nullable: true }),
        recipient: stringArg({ nullable: true }),
        text: stringArg({ required: true })
      },
      resolve: async (_, { channelId, recipient, text }, ctx) => {
        const userId = getUserId(ctx);
        if (userId === recipient) return false;
        // if a channelId is given, aka not delete

        if (channelId) {
          try {
            const message = await ctx.prisma.message.create({
              data: {
                text,
                sentBy: { connect: { id: userId } },
                channel: { connect: { id: channelId } }
              }
            });
            if (!message) return false;
            message.channelId = channelId;
            ctx.pubsub.publish(PUB_NEW_MESSAGE, { newMessage: message });
            return true;
          } catch (error) {
            throw new Error('La creation du message a echoue');
          }
        }

        // if no channelId is given, check if one already exist
        const results = await ctx.prisma.channel.findMany({
          where: {
            AND: [
              { users: { some: { id: userId } } },
              { users: { some: { id: recipient } } }
            ]
          }
        });

        if (results[0]) {
          try {
            const channelId = results[0].id;
            const message = await ctx.prisma.message.create({
              data: {
                channel: { connect: { id: channelId } },
                text,
                sentBy: { connect: { id: userId } }
              }
            });
            if (!message) return false;
            message.channelId = channelId;
            ctx.pubsub.publish(PUB_NEW_MESSAGE, { newMessage: message });
            return true;
          } catch (error) {
            throw new Error('La creation du message a echoue');
          }
        }

        // default case, create a channel and continue

        try {
          const channel = await ctx.prisma.channel.create({
            data: {
              users: { connect: [{ id: recipient }, { id: userId }] }
            }
          });
          if (!channel) {
            throw new Error(
              'La creation de la chaine de communication a echoue'
            );
          }
          const channelId = channel.id;
          const message = await ctx.prisma.message.create({
            data: {
              text,
              sentBy: { connect: { id: userId } },
              channel: { connect: { id: channelId } }
            }
          });
          if (!message) return false;
          ctx.pubsub.publish(PUB_NEW_MESSAGE, { newMessage: message });
          return true;
        } catch (error) {
          throw new Error('La creation de Channel ou de message a echoue');
        }
      }
    });
  }
});

exports.SubscriptionMessage = subscriptionField('newMessage', {
  type: 'message',
  args: { channelId: stringArg({ required: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_MESSAGE),
    (payload, variables) => {
      return payload.newMessage.channelId === variables.channelId;
    }
  ),
  resolve: payload => {
    return payload.newMessage;
  }
});
