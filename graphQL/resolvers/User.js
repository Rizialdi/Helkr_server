import jwt from 'jsonwebtoken';
import { APP_SECRET_CODE, getUserId } from './utils';

export default {
  Query: {
    // TODO sanitization on provided id
    user: async (_, { numero }, context) => {
      const user = await context.prisma.user.findOne({ where: { numero } });
      if (!user) return new Error('Utilisateur non existant');
      return user;
    },
    userById: async (_, { id }, context) => {
      const user = await context.prisma.user.findOne({ where: { id } });
      if (!user) return new Error('Utilisateur non existant');
      return user;
    },
    getUserInfo: async (_, { numero }, context) => {
      const user = await context.prisma.user.findOne({ where: { numero } });
      if (!user) {
        throw new Error('Utilisateur non existant');
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE);

      return {
        token,
        user
      };
    },
    // TODO check that the user is authenticated for seeing users list
    // TODO projection efficiently get the field asked for
    // TODO implement pagination
    users: async (_, __, context) => {
      return context.prisma.user.findMany();
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
      const { score } = completed.reduce((a, b) => ({
        score: a.score + b.score
      }));
      const average = Number((score / done).toFixed(1));
      return { done, proposed, average };
    }
  }, // TODO Update a User by adding an avatar
  Mutation: {
    registerUser: async (_, { nom, prenom, numero }, context) => {
      const user = await context.prisma.user.create({
        data: { nom, prenom, numero }
      });
      const token = jwt.sign({ userId: user.id }, APP_SECRET_CODE);

      return {
        token,
        user
      };
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
    }
  }
};
