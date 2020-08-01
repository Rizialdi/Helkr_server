import { extendType, objectType, stringArg } from '@nexus/schema';
import { getUserId } from '../../utils';

exports.NotificationsToken = objectType({
  name: 'notificationstoken',
  definition(t) {
    t.model.id();
    t.model.token();
    t.model.userid();
    t.model.utilisateur();
  }
});

exports.QueryNotificationsToken = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allUsersToken', {
      type: 'notificationstoken',
      resolve: async (_, __, ctx) => {
        try {
          const tokens = await ctx.prisma.notificationstoken.findMany();
          return tokens || [];
        } catch (error) {
          throw new Error(`Tokens retrieval impossible ${error}`);
        }
      }
    });
  }
});

exports.MutationNotificationsToken = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('notificationsTokenUpdate', {
      type: 'Boolean',
      args: {
        token: stringArg({ required: true })
      },
      resolve: async (_, { token }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const notificationstoken = await ctx.prisma.notificationstoken.upsert(
            {
              create: { token, utilisateur: { connect: { id: userId } } },
              update: { token },
              where: { userid: userId }
            }
          );
          if (!notificationstoken) return false;
          return true;
        } catch (error) {
          throw new Error(error);
        }
      }
    });
  }
});
