export default {
  Query: {
    getMoyenneUser: async (_, { userId }, context) => {
      const moyenne = await context.prisma.moyenne.findOne({
        where: { user: { id: userId } }
      });
      if (!moyenne) return new Error('Aucune moyenne associee');
      return moyenne;
    }
  },
  Moyenne: {
    user: async (parent, __, { prisma }) => {
      const user = await prisma.user.findMany({
        where: { moyenne: { some: { id: parent.id } } }
      });
      return user[0];
    }
  }
};
