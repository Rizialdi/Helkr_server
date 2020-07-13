import { objectType, extendType, stringArg } from '@nexus/schema';
import { getUserId } from '../../utils';

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
        listofauthorizedcategories: stringArg({ required: true })
      },
      resolve: async (_, { id, listofauthorizedcategories }, ctx) => {
        const userId = id ? id : getUserId(ctx);
        const authorizedcategories = await ctx.prisma.authorizedcategories.upsert(
          {
            where: { userId },
            create: {
              listofauthorizedcategories,
              utilisateur: { connect: { id: userId } }
            },
            update: { listofauthorizedcategories }
          }
        );
        if (!authorizedcategories) return false;
        return true;
      }
    });
  }
});
