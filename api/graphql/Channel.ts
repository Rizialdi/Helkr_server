import {
  objectType,
  extendType,
  stringArg,
  subscriptionField
} from '@nexus/schema';
import { getUserId } from '../../utils';
import { withFilter } from 'graphql-yoga';
import { PUB_NEW_CHANNEL } from './constants';
import { utilisateur } from '@prisma/client';

exports.Channel = objectType({
  name: 'channel',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.messages({
      type: 'message',
      resolve: (parent, __, { prisma }) => {
        return prisma.message.findMany({
          orderBy: { createdAt: 'desc' },
          where: { channelId: parent.id }
        });
      }
    });
    t.model.users({
      type: 'utilisateur',
      resolve: (parent, __, { prisma }) => {
        return prisma.utilisateur.findMany({
          where: { channels: { some: { id: parent.id } } }
        });
      }
    });
  }
});

exports.QueryChannel = extendType({
  type: 'Query',
  definition(t) {
    t.field('channel', {
      type: 'channel',
      args: { id: stringArg({ required: true }) },
      resolve: async (_, { id }, { prisma }) => {
        try {
          const channel = await prisma.channel.findMany({
            where: { id }
          });
          return channel[0];
        } catch (error) {
          throw new Error(`Channel query impossible ${error}`);
        }
      }
    });
    t.list.field('channels', {
      type: 'channel',
      resolve: async (_, __, { prisma }) => {
        const channels = await prisma.channel.findMany();
        return channels;
      }
    });
    t.list.field('allChatsAndMessages', {
      type: 'channel',
      resolve: async (_, __, ctx) => {
        try {
          const userId = getUserId(ctx);
          const chatsAndMessages = await ctx.prisma.channel.findMany({
            where: { users: { some: { id: userId } } },
            include: {
              messages: { orderBy: { createdAt: 'desc' } },
              users: true
            }
          });
          if (!chatsAndMessages) return [];
          return chatsAndMessages;
        } catch (error) {
          throw new Error(`All chats and messages query impossible ${error}`);
        }
      }
    });
    //TODO to define according to your messages
    // t.field('recipientChannels', {
    //   type: 'channel',
    //   args: { id: stringArg({ required: true }) },
    //   resolve: async (_, { id }, { prisma }) => {
    //     const channel = await prisma.channel.findOne({ where: { id } });
    //     if (!channel) return new Error('Chaine inexistante');
    //     return channel;
    //   }
    // });
  }
});

exports.MutationChannel = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createChannel', {
      type: 'createChannel',
      args: { recipient: stringArg({ required: true }) },
      resolve: async (_, { recipient }, ctx) => {
        try {
          const sentBy = getUserId(ctx);
          if (sentBy === recipient)
            throw new Error('Creation chaine impossible');
          const channel = await ctx.prisma.channel.create({
            data: {
              users: {
                connect: [{ id: recipient }, { id: sentBy }]
              }
            }
          });

          if (!channel) {
            return {
              success: false,
              channel
            };
          }
          return {
            success: true,
            channel
          };
        } catch (error) {
          throw new Error('La creation de chaine a echoue');
        }
      }
    });
  }
});

exports.CreateChannel = objectType({
  name: 'createChannel',
  definition(t) {
    t.boolean('success', { nullable: false });
    t.field('channel', { type: 'channel', nullable: false });
  }
});

exports.SubscriptionChannel = subscriptionField('newChannel', {
  type: 'channel',
  args: { userId: stringArg({ required: true }) },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator(PUB_NEW_CHANNEL),
    (payload, variables) => {
      const userIds: string[] = [];

      payload.newChannel.users.map((item: utilisateur) =>
        userIds.push(item.id)
      );
      return userIds.includes(variables.userId);
    }
  ),
  resolve: payload => {
    return payload.newChannel;
  }
});
