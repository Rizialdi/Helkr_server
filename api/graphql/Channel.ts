import { objectType, extendType, stringArg } from '@nexus/schema';
import { getUserId } from '../../utils';

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
        return prisma.channel.findOne({ where: { id } });
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
              messages: { last: 10, orderBy: { createdAt: 'desc' } },
              users: true
            }
          });
          if (!chatsAndMessages) return;
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
            data: { users: { connect: [{ id: recipient }, { id: sentBy }] } }
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
