import { objectType, extendType, stringArg } from '@nexus/schema';
import { getUserId } from '../../utils';

exports.VerificationPiece = objectType({
  name: 'verificationpieces',
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.listofpieces({});
    t.model.utilisateur();
    t.model.referenceid();
    t.model.status();
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
    }),
      t.field('getSendVerificationPiecesReferenceIdsAndStatus', {
        type: 'String',
        args: { id: stringArg({ nullable: true }) },
        resolve: async (_, { id }, ctx) => {
          const userId = id ? id : getUserId(ctx);
          const refNstatus = await ctx.prisma.verificationpieces.findMany({
            where: { userId },
            select: {
              referenceid: true,
              status: true,
              createdAt: true
            }
          });

          if (!refNstatus.length) return '';

          const uniqueRefId = [
            ...new Set(refNstatus.map(item => item.referenceid))
          ];

          const toReturnInt = uniqueRefId.map(refId => {
            const listOfSameRefId = refNstatus.filter(
              item => item.referenceid === refId
            );
            return listOfSameRefId.reduce((a, b) =>
              new Date(a.createdAt) > new Date(b.createdAt) ? a : b
            );
          });

          const toReturn = toReturnInt
            .map(item => {
              return {
                [item.referenceid]: item.status
              };
            })
            .reduce((a, b) => ({ ...a, ...b }));
          if (!toReturn) return '';
          return JSON.stringify(toReturn);
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
        listofpieces: stringArg({ required: true }),
        referenceId: stringArg({ required: true })
      },
      resolve: async (_, { id, listofpieces, referenceId }, ctx) => {
        try {
          const userId = id ? id : getUserId(ctx);
          const parsedValues = JSON.parse(listofpieces);

          const handleImageLoading = async (): Promise<
            { [x: string]: string }[]
          > => {
            const relativeUri = await Object.entries(parsedValues).map(
              async ([key, value]) => {
                const cloudUri = await ctx.processUpload(value);
                return { [key]: cloudUri };
              }
            );
            return Promise.all(relativeUri);
          };

          const toStore = await handleImageLoading();

          const verificationPieces = await ctx.prisma.verificationpieces.create(
            {
              data: {
                listofpieces: JSON.stringify(toStore),
                referenceid: referenceId,
                status: 'enattente',
                utilisateur: { connect: { id: userId } }
              }
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
