import { extendType, objectType } from '@nexus/schema';
import { getUserId } from '../../utils';
import { requiredStr } from './Offering';

exports.Tags = objectType({
  name: 'tags',
  definition(t) {
    t.model.id();
    t.model.tags();
    t.model.userid();
    t.model.utilisateur();
  }
});

exports.MutationTags = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('tagsUpdate', {
      type: 'Boolean',
      args: {
        tags: requiredStr({ list: true })
      },
      resolve: async (_, { tags }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const tagz = await ctx.prisma.tags.upsert({
            create: {
              tags: JSON.stringify(tags),
              utilisateur: { connect: { id: userId } }
            },
            update: { tags: JSON.stringify(tags) },
            where: { userid: userId }
          });
          if (!tagz) return false;
          return true;
        } catch (error) {
          throw new Error(error);
        }
      }
    });
  }
});
