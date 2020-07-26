import { objectType, extendType, stringArg } from '@nexus/schema';
import { getUserId } from '../../utils';
import { requiredStr } from './Offering';

exports.AuthorizedCategories = objectType({
  name: 'authorizedcategories',
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.listofauthorizedcategories();
    t.model.utilisateur();
  }
});

exports.QueryAuthorizedCategories = extendType({
  type: 'Query',
  definition(t) {
    t.field('getAuthorizedCategories', {
      type: 'authorizedcategories',
      args: { id: stringArg({ nullable: true }) },
      resolve: async (_, { id }, ctx) => {
        const userId = id ? id : getUserId(ctx);
        const authorizedcategories = await ctx.prisma.authorizedcategories.findMany(
          { where: { userId } }
        );
        return authorizedcategories[0];
      }
    });
  }
});

exports.MutationAuthorizedCategories = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addAuthorizedCategories', {
      type: 'Boolean',
      args: {
        id: stringArg({ nullable: true }),
        authorizedcategory: stringArg({ required: true })
      },
      resolve: async (_, { id, authorizedcategory }, ctx) => {
        const userId = id ? id : getUserId(ctx);

        const authorizedcategories = await ctx.prisma.authorizedcategories.findOne(
          {
            where: { userId },
            select: { listofauthorizedcategories: true }
          }
        );
        if (
          authorizedcategories &&
          authorizedcategories.listofauthorizedcategories
        ) {
          const listofauthorizedcategories = [
            ...new Set([
              ...JSON.parse(
                authorizedcategories.listofauthorizedcategories as string
              ),
              authorizedcategory
            ])
          ];
          const data = await ctx.prisma.authorizedcategories.update({
            where: { userId },
            data: {
              listofauthorizedcategories: JSON.stringify(
                listofauthorizedcategories
              )
            }
          });

          if (!data) return false;
          return true;
        }

        const newAuth = await ctx.prisma.authorizedcategories.create({
          data: {
            listofauthorizedcategories: JSON.stringify([authorizedcategory]),
            utilisateur: { connect: { id: userId } }
          }
        });

        console.log('im tada');
        if (!newAuth) return false;
        return true;
      }
    });
    t.field('removeAuthorizedCategories', {
      type: 'Boolean',
      args: {
        id: stringArg({ nullable: true }),
        referenceId: requiredStr({ required: true })
      },
      resolve: async (_, { id, referenceId }, ctx) => {
        const userId = id ? id : getUserId(ctx);
        try {
          const authorizedcategories = await ctx.prisma.authorizedcategories.findOne(
            { where: { userId }, select: { listofauthorizedcategories: true } }
          );
          if (!authorizedcategories) return false;
          const array: string[] = JSON.parse(
            authorizedcategories.listofauthorizedcategories as string
          );
          if (!array.includes(referenceId)) return false;
          const newArray = array.filter(i => i != referenceId);
          const newAuthorizedcategories = await ctx.prisma.authorizedcategories.update(
            {
              where: { userId },
              data: { listofauthorizedcategories: JSON.stringify(newArray) }
            }
          );
          if (!newAuthorizedcategories) return false;
          return true;
        } catch (error) {
          throw new Error(`Remove of authorized category impossible, ${error}`);
        }
      }
    });
  }
});
