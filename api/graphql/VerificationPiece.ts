import { objectType, extendType, stringArg, convertSDL } from '@nexus/schema';
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

exports.Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addVerificationpieces', {
      type: 'Boolean',
      args: {
        id: stringArg({ nullable: true }),
        listofpieces: stringArg({ required: true })
      },
      resolve: async (_, { id, listofpieces }, ctx) => {
        try {
          const userId = id ? id : getUserId(ctx);
          const parsedValues = JSON.parse(listofpieces);
          //TODO Issue of pending promises
          const toStore = Object.entries(parsedValues).map(
            async ([key, value], _) => {
              const cloudUri = await ctx.processUpload(value);
              console.log(cloudUri);
              return { [key]: cloudUri };
            }
          );

          toStore && console.log(await toStore);

          const toStoreStringified = await JSON.stringify(toStore);
          toStore && console.log('toStore', await toStore);
          const verificationPieces = await ctx.prisma.verificationpieces.upsert(
            {
              where: { userId },
              create: {
                listofpieces: toStoreStringified,
                utilisateur: { connect: { id: userId } }
              },
              update: { listofpieces: toStoreStringified }
            }
          );
          if (!verificationPieces) return false;
          return true;
        } catch (error) {
          throw new Error(`${error}`);
        }
      }
    });
  }
});
