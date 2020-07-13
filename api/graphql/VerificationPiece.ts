import { objectType, extendType, stringArg } from '@nexus/schema';
import { getUserId } from '../../utils';

exports.VerificationPiece = objectType({
  name: 'verificationpieces',
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.listofpieces({});
    t.model.utilisateur();
  }
});

exports.QueryVerificationPiece = extendType({
  type: 'Query',
  definition(t) {
    t.field('getVerificationPieces', {
      type: 'verificationpieces',
      args: { id: stringArg({ nullable: true }) },
      resolve: async (_, { id }, ctx) => {
        const userId = id ? id : getUserId(ctx);
        const verificationpieces = await ctx.prisma.verificationpieces.findMany(
          { where: { userId } }
        );
        return verificationpieces[0];
      }
    });
  }
});

exports.MutationVerificationpiece = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addVerificationpieces', {
      type: 'Boolean',
      args: {
        id: stringArg({ nullable: true }),
        listofpieces: stringArg({ required: true })
      },
      resolve: async (_, { id, listofpieces }, ctx) => {
        const userId = id ? id : getUserId(ctx);
        const verificationPieces = await ctx.prisma.verificationpieces.upsert({
          where: { userId },
          create: {
            listofpieces,
            utilisateur: { connect: { id: userId } }
          },
          update: { listofpieces }
        });
        if (!verificationPieces) return false;
        return true;
      }
    });
  }
});
