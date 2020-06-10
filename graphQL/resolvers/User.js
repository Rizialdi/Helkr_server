import jwt from 'jsonwebtoken';
import { APP_SECRET_CODE, getUserId } from '../../utils';

export default {
  Query: {
    // TODO sanitization on provided id
    user: async (_, { numero }, context) => {
      try {
        const user = await context.prisma.utilisateur.findOne({
          where: { numero }
        });
        if (!user) {
          throw new Error('Utilisateur non existant');
        }
        return user;
      } catch (error) {
        throw new Error('Utilisateur non existant', error);
      }
    },
    userById: async (_, { id }, context) => {
      try {
        const user = await context.prisma.utilisateur.findOne({
          where: { id }
        });
        if (!user) {
          throw new Error('Utilisateur non existant');
        }

        return user;
      } catch (error) {
        throw new Error('Utilisateur non existant', error);
      }
    },
    getUserInfo: async (_, { numero }, context) => {
      try {
        const user = await context.prisma.utilisateur.findOne({
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
        throw new Error('Utilisateur non existant', error);
      }
    },
    // TODO check that the user is authenticated for seeing users list
    // TODO projection efficiently get the field asked for
    // TODO implement pagination
    users: async (_, __, context) => {
      return context.prisma.utilisateur.findMany();
    },
    getUserStats: async (_, { id }, context) => {
      const prop = await context.prisma.offering.findMany({
        where: { author: { id } }
      });
      const completed = await context.prisma.avis.findMany({
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
    }
  }, // TODO Update a User by adding an avatar
  Mutation: {
    registerUser: async (_, { nom, prenom, numero }, context) => {
      const user = await context.prisma.utilisateur.create({
        data: { nom, prenom, numero }
      });
      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE);

      return {
        token,
        user
      };
    },
    avatarUpload: async (_, { file }, context) => {
      const userId = getUserId(context);

      try {
        const avatar = await context.processUpload(file);
        const user = await context.prisma.utilisateur.update({
          where: { id: userId },
          data: { avatar }
        });
        if (!user) return false;
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    descriptionUpdate: async (_, { text }, context) => {
      const userId = getUserId(context);

      try {
        const user = await context.prisma.utilisateur.update({
          where: { id: userId },
          data: { description: text }
        });
        if (!user) return false;
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    addressUpdate: async (_, { text }, context) => {
      const userId = getUserId(context);

      try {
        const user = await context.prisma.utilisateur.update({
          where: { id: userId },
          data: { address: text }
        });
        if (!user) return false;
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    tagsUpdate: async (_, { tags }, context) => {
      const userId = getUserId(context);

      try {
        const user = await context.prisma.utilisateur.update({
          where: { id: userId },
          data: { tags: { set: tags } }
        });
        if (!user) return false;
        return true;
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  User: {
    offerings: async (parent, __, { prisma }) => {
      const offerings = await prisma.offering.findMany({
        where: { author: { id: parent.id } }
      });
      return offerings;
    },
    channels: async (parent, __, { prisma }) => {
      const channels = await prisma.channel.findMany({
        where: { users: { some: { id: parent.id } } }
      });
      return channels;
    },
    messages: async (parent, __, { prisma }) => {
      const messages = await prisma.message.findMany({
        where: { sentBy: { id: parent.id } }
      });
      return messages;
    },
    completedofferings: async (parent, __, { prisma }) => {
      const completedofferings = await prisma.offering.findMany({
        where: { completedBy: { id: parent.id } }
      });
      return completedofferings;
    },
    avisreceived: async (parent, __, { prisma }) => {
      const avis = await prisma.avis.findMany({
        where: { scored: { id: parent.id } }
      });
      return avis;
    },
    avisgave: async (parent, __, { prisma }) => {
      const avis = await prisma.avis.findMany({
        where: { scorer: { id: parent.id } }
      });
      return avis;
    },
    appliedTo: async (parent, __, { prisma }) => {
      const avis = await prisma.offering.findMany({
        where: { candidates: { some: { id: parent.id } } }
      });
      return avis;
    }
  }
};
