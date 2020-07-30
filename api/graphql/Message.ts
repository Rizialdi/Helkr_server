import { withFilter } from 'graphql-yoga';
import { PUB_NEW_MESSAGE, PUB_NEW_CHANNEL } from './constants';
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
    t.model.createdAt();
    t.model.channelId();
    t.model.channel();
  }
});

exports.QueryMessages = extendType({
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

exports.MutationMessages = extendType({
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

            ctx.pubsub.publish(PUB_NEW_MESSAGE, {
              newMessage: message
            });
            return true;
          } catch (error) {
            throw new Error('La creation du message a echoue');
          }
        }

        // if no channelId is given, check if one already exist
        const results = recipient
          ? await ctx.prisma.channel.findMany({
              where: {
                AND: [
                  { users: { some: { id: userId } } },
                  { users: { some: { id: recipient } } }
                ]
              }
            })
          : [];

        if (results[0]) {
          try {
            const newChannelId = results[0].id;
            const message = await ctx.prisma.message.create({
              data: {
                text,
                sentBy: { connect: { id: userId } },
                channel: { connect: { id: newChannelId } }
              }
            });
            if (!message) return false;

            ctx.pubsub.publish(PUB_NEW_MESSAGE, {
              newMessage: message
            });
            return true;
          } catch (error) {
            throw new Error('La creation du message a echoue');
          }
        }

        // default case, create a channel and continue
        try {
          const channel = recipient
            ? await ctx.prisma.channel.create({
                data: {
                  users: {
                    connect: [{ id: recipient }, { id: userId }]
                  },
                  messages: {
                    create: {
                      text,
                      sentBy: {
                        connect: { id: userId }
                      }
                    }
                  }
                },
                include: {
                  messages: true,
                  users: {
                    select: {
                      id: true,
                      nom: true,
                      prenom: true,
                      avatar: true
                    }
                  }
                }
              })
            : null;

          if (!channel) {
            throw new Error(
              'La creation de la chaine de communication a echoue'
            );
          }

          if (!channel) return false;

          ctx.pubsub.publish(PUB_NEW_CHANNEL, {
            newChannel: channel
          });
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
  args: { channelIds: stringArg({ required: true, list: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_MESSAGE),
    (payload, variables) => {
      return variables.channelIds.includes(payload.newMessage.channel.id);
    }
  ),
  resolve: payload => {
    return payload.newMessage;
  }
});
