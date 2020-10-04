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

exports.AddJobberTagResponse = objectType({
  name: 'AddJobberTagResponse',
  definition(t) {
    t.boolean('max');
    t.boolean('added');
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
    t.field('tagsAddJobber', {
      type: 'AddJobberTagResponse',
      args: {
        tag: requiredStr({})
      },
      resolve: async (_, { tag }, ctx) => {
        const userId = getUserId(ctx);

        try {
          const result = await ctx.prisma.tags.findOne({
            where: { userid: userId }
          });

          const parsedValue: string[] = JSON.parse(
            result && result.tags ? result.tags : '[]'
          );

          if (parsedValue.length > 3) return { max: true, added: false };

          const tagz = await ctx.prisma.tags.upsert({
            create: {
              tags: JSON.stringify([tag]),
              utilisateur: { connect: { id: userId } }
            },
            update: {
              tags: JSON.stringify([
                ...new Set([
                  tag,
                  ...(JSON.parse(
                    result && result.tags ? result.tags : '[]'
                  ) as string[])
                ])
              ])
            },
            where: { userid: userId }
          });

          if (!tagz) return { max: false, added: false };

          return { max: false, added: true };
        } catch (error) {
          throw new Error(error);
        }
      }
    });
  }
});
