import { objectType, queryType, mutationType, extendType } from '@nexus/schema';
import jwt from 'jsonwebtoken';
import { APP_SECRET_CODE, getUserId } from '../../utils';

exports.User = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('nom');
    t.string('avatar', { nullable: true });
    t.string('prenom');
    t.string('numero');
    t.list.string('tags');
    t.string('address', { nullable: true });
    t.string('description', { nullable: true });
    t.boolean('professional');
    t.boolean('verified');
    t.string('createdAt');
    t.string('updatedAt');
    t.list.field('offering', {
      type: 'Offering',
      nullable: true,
      description: 'List of offers proposed by an user'
    });
    t.list.field('offerings', {
      type: 'Offering',
      nullable: true,
      description: 'List of offers proposed by an user',
      resolve: async (parent, _, ctx) => {
        const offerings = await ctx.db.offering.findMany({
          where: { author: { id: parent.id } }
        });
        return offerings;
      }
    });
    t.list.field('completedofferings', {
      type: 'Offering',
      nullable: true,
      description: 'List of offerings completed by an user',
      resolve: async (parent, _, ctx) => {
        const completedofferings = await ctx.db.offering.findMany({
          where: { completedBy: { id: parent.id } }
        });
        return completedofferings;
      }
    });
    t.list.field('avisreceived', {
      type: 'Avis',
      nullable: true,
      description: 'List comments received by an user',
      resolve: async (parent, _, ctx) => {
        const avis = await ctx.db.avis.findMany({
          where: { scored: { id: parent.id } }
        });
        return avis;
      }
    });
    t.list.field('avisgave', {
      type: 'Avis',
      nullable: true,
      description: 'List comments received by an user',
      resolve: async (parent, _, ctx) => {
        const avis = await ctx.db.avis.findMany({
          where: { scorer: { id: parent.id } }
        });
        return avis;
      }
    });
    t.list.field('channels', {
      type: 'Channel',
      nullable: true,
      description: 'Channels in which an user sent / received a message',
      resolve: async (parent, _, ctx) => {
        const channels = await ctx.db.channel.findMany({
          where: { users: { some: { id: parent.id } } }
        });
        return channels;
      }
    });
    t.list.field('messages', {
      type: 'Message',
      nullable: true,
      description: 'List of messages sent by an user',
      resolve: async (parent, _, ctx) => {
        const messages = await ctx.db.message.findMany({
          where: { sentBy: { id: parent.id } }
        });
        return messages;
      }
    });
    t.float('moyenne', {
      nullable: false,
      description: 'Mark of an user in the platform'
    });
    t.list.field('appliedTo', {
      type: 'Offering',
      nullable: true,
      description: 'List of offerings applied by an user',
      resolve: async (parent, __, ctx) => {
        const avis = await ctx.db.offering.findMany({
          where: { candidates: { some: { id: parent.id } } }
        });
        return avis;
      }
    });
  }
});

exports.Query = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: async (_, __, ctx) => {
        const users = await ctx.db.utilisateur.findMany();
        return users;
      }
    });
    t.field('user', {
      type: 'User',
      args: { numero: 'String' },
      resolve: async (_, { numero }, ctx) => {
        try {
          const user = await ctx.db.utilisateur.findOne({ where: { numero } });
          if (!user) {
            throw new Error('Utilisateur non existant');
          }
          return user;
        } catch (error) {
          throw new Error(`Utilisateur non existant ${error}`);
        }
      }
    });
    t.field('userById', {
      type: 'User',
      args: { id: 'String' },
      resolve: async (_, { id }, ctx) => {
        try {
          const user = await ctx.db.utilisateur.findOne({
            where: { id }
          });
          if (!user) {
            throw new Error('Utilisateur non existant');
          }

          return user;
        } catch (error) {
          throw new Error(`Utilisateur non existant ${error}`);
        }
      }
    });
    t.field('getUserInfo', {
      type: 'AuthPayload',
      args: { numero: 'String' },
      resolve: async (_, { numero }, ctx) => {
        try {
          const user = await ctx.db.utilisateur.findOne({
            where: { numero }
          });
          if (!user) {
            throw new Error('Utilisateur non existant');
          }

          const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE);

          return {
            token,
            user
          };
        } catch (error) {
          throw new Error(`Utilisateur non existant ${error}`);
        }
      }
    });
    t.field('getUserStats', {
      type: 'Stats',
      args: { id: 'String' },
      resolve: async (_, { id }, ctx) => {
        try {
          const prop = await ctx.db.offering.findMany({
            where: { author: { id } }
          });
          const completed = await ctx.db.avis.findMany({
            where: { scored: { id } }
          });

          const proposed = prop.length;
          const done = completed.length;
          const { score } =
            done != 0
              ? completed.reduce((a, b) => ({
                  score: a.score + b.score
                }))
              : 0;

          const average = done != 0 ? Number((score / done).toFixed(1)) : 0;
          return { done, proposed, average };
        } catch (error) {}
      }
    });
  }
});

exports.Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('registerUser', {
      type: 'AuthPayload',
      args: { nom: 'String', prenom: 'String', numero: 'String' },
      resolve: async (_, { nom, prenom, numero }, ctx) => {
        try {
          const user = await ctx.db.utilisateur.create({
            data: { nom, prenom, numero }
          });

          const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE);

          return {
            token,
            user
          };
        } catch (error) {
          throw new Error(`${error}`);
        }
      }
    });
    t.field('avatarUpload', {
      type: 'Boolean',
      args: { file: 'String' },
      resolve: async (_, { file }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const avatar = await ctx.processUpload(file);
          const user = await ctx.db.utilisateur.update({
            where: { id: userId },
            data: { avatar }
          });
          if (!user) return false;
          return true;
        } catch (error) {
          throw new Error(error);
        }
      }
    });
    t.field('descriptionUpdate', {
      type: 'Boolean',
      args: { text: 'String' },
      resolve: async (_, { text }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const user = await ctx.db.utilisateur.update({
            where: { id: userId },
            data: { description: text }
          });
          if (!user) return false;
          return true;
        } catch (error) {
          throw new Error(error);
        }
      }
    });
    t.field('addressUpdate', {
      type: 'Boolean',
      args: { text: 'String' },
      resolve: async (_, { text }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const user = await ctx.db.utilisateur.update({
            where: { id: userId },
            data: { address: text }
          });
          if (!user) return false;
          return true;
        } catch (error) {
          throw new Error(error);
        }
      }
    });
    t.field('tagsUpdate', {
      type: 'Boolean',
      args: { tags: 'String' },
      resolve: async (_, { tags }, ctx) => {
        const userId = getUserId(ctx);
        try {
          const user = await ctx.db.utilisateur.update({
            where: { id: userId },
            data: { tags: { set: tags } }
          });
          if (!user) return false;
          return true;
        } catch (error) {
          throw new Error(error);
        }
      }
    });
  }
});

exports.AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.field('user', { type: 'User' });
  }
});

exports.Stats = objectType({
  name: 'Stats',
  definition(t) {
    t.int('done');
    t.int('proposed');
    t.float('average');
  }
});
