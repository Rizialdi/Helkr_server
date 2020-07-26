import jwt, { Secret } from 'jsonwebtoken';
import {
  arg,
  core,
  extendType,
  inputObjectType,
  intArg,
  objectType,
  stringArg
} from '@nexus/schema';

import { APP_SECRET_CODE, getUserId } from '../../utils';
import { requiredStr } from './Offering';

exports.User = objectType({
  name: 'utilisateur',
  definition(t) {
    t.model.id();
    t.model.nom();
    t.model.prenom();
    t.model.avatar();
    t.model.numero();
    t.model.tags();
    t.model.address();
    t.model.description();
    t.model.professional();
    t.model.verified();
    t.model.verificationpieces();
    t.model.offerings({
      type: 'offering',
      resolve: (parent, _, { prisma }) => {
        return prisma.offering.findMany({
          where: { author: { id: parent.id } }
        });
      }
    });
    t.model.completedofferings({
      type: 'offering',
      resolve: (parent, _, { prisma }) => {
        return prisma.offering.findMany({
          where: { completedBy: { id: parent.id } }
        });
      }
    });
    t.model.channels({
      type: 'channel',
      resolve: (parent, _, { prisma }) => {
        return prisma.channel.findMany({
          where: { users: { some: { id: parent.id } } }
        });
      }
    });
    t.model.messages({
      type: 'message',
      resolve: (parent, _, { prisma }) => {
        return prisma.message.findMany({
          where: { sentBy: { id: parent.id } }
        });
      }
    });
    t.model.avisreceived({
      type: 'avis',
      resolve: (parent, _, { prisma }) => {
        return prisma.avis.findMany({
          where: { scored: { id: parent.id } }
        });
      }
    });
    t.model.avisgave({
      type: 'avis',
      resolve: (parent, _, { prisma }) => {
        return prisma.avis.findMany({
          where: { scorer: { id: parent.id } }
        });
      }
    });
    t.field('moyenne', {
      type: 'Int',
      resolve: async (parent, __, { prisma }) => {
        const data = await prisma.moyenne.findMany({
          where: { userId: parent.id }
        });
        if (data.length > 0) {
          const { moyenne } = data[0];
          return moyenne;
        }
        return 0;
      }
    });
  }
});

exports.QueryUser = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'utilisateur',
      resolve: async (_, __, ctx) => {
        try {
          const users = await ctx.prisma.utilisateur.findMany();
          return users;
        } catch (error) {
          throw new Error('Utilisateurs non existant');
        }
      }
    });
    t.field('userById', {
      type: 'utilisateur',
      args: { id: stringArg({ required: true }) },
      resolve: async (_, { id }, { prisma }) => {
        try {
          const user = await prisma.utilisateur.findOne({
            where: { id }
          });
          if (!user) {
            throw new Error('Utilisateur non existant');
          }

          return user;
        } catch (error) {
          throw new Error('Utilisateur non existant');
        }
      }
    });
    t.field('getUserInfo', {
      type: 'AuthPayload',
      args: { numero: stringArg({ required: true }) },
      resolve: async (_, { numero }, { prisma }) => {
        try {
          const user = await prisma.utilisateur.findOne({
            where: { numero }
          });
          if (!user) {
            throw new Error('Utilisateur non existant');
          }

          const token: string = jwt.sign(
            { userId: user.id },
            APP_SECRET_CODE as Secret
          );

          return {
            token,
            user
          };
        } catch (error) {
          throw new Error('Utilisateur non existant');
        }
      }
    });
    t.field('getUserStats', {
      type: 'Stats',
      args: { id: stringArg({ required: true }) },
      resolve: async (_, { id }, { prisma }) => {
        const prop = await prisma.offering.findMany({
          where: { author: { id } }
        });
        const completed = await prisma.avis.findMany({
          where: { scored: { id } }
        });

        const proposed = prop.length;
        const done = completed.length;
        //@ts-ignore
        const { score } =
          done === 0
            ? 0
            : //@ts-ignore
              completed.reduce((a, b) => ({
                score: a.score + b.score
              }));

        const average = done != 0 ? Number((score / done).toFixed(1)) : 0;
        return { done, proposed, average };
      }
    });
  }
});

exports.MutationUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('registerUser', {
      type: 'AuthPayload',
      args: {
        nom: stringArg({ required: true }),
        prenom: stringArg({ required: true }),
        numero: stringArg({ required: true })
      },
      resolve: async (_, { nom, prenom, numero }, { prisma }) => {
        const user = await prisma.utilisateur.create({
          data: {
            nom,
            prenom,
            numero,
            authorizedcategories: {
              create: { listofauthorizedcategories: '' }
            }
          }
        });
        const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE as Secret);

        return {
          token,
          user
        };
      }
    });
    t.field('avatarUpload', {
      type: 'Boolean',
      args: {
        file: stringArg({ required: true })
      },
      resolve: async (_, { file }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const avatar = await ctx.processUpload(file);
          const user = await ctx.prisma.utilisateur.update({
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
      args: {
        text: stringArg({ required: true })
      },
      resolve: async (_, { text }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const user = await ctx.prisma.utilisateur.update({
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
      args: {
        text: stringArg({ required: true })
      },
      resolve: async (_, { text }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const user = await ctx.prisma.utilisateur.update({
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
      args: {
        tags: requiredStr({ list: true, required: true })
      },
      resolve: async (_, { tags }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const user = await ctx.prisma.utilisateur.update({
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
    t.field('user', { type: 'utilisateur' });
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
