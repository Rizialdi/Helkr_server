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
        id: stringArg({ required: true }),
        authorizedcategory: stringArg({ required: true })
      },
      resolve: async (_, { id, authorizedcategory }, ctx) => {
        const userId = id;

        // Function for updating status code on sent pieces
        const updateStatus = async (referenceid: string) => {
          const res = await ctx.prisma.verificationpieces.updateMany({
            where: { AND: [{ userId }, { referenceid }] },
            data: { status: 'accepte' }
          });
          if (!res) return;
          return res;
        };

        const authorizedcategories = await ctx.prisma.authorizedcategories.findOne(
          {
            where: { userId },
            select: { listofauthorizedcategories: true }
          }
        );

        const notificationToken = await ctx.prisma.notificationstoken.findOne({
          where: {
            userid: userId
          },
          select: { token: true }
        });

        notificationToken &&
          notificationToken.token &&
          ctx.sendPushNotification(notificationToken.token, [
            'Validation de profil',
            'Votre profil a été validé pour une nouvelle catégorie',
            {
              screenToRedirect: 'Reload'
            }
          ]);

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

          const statusUpdated = await updateStatus(authorizedcategory);

          if (!statusUpdated) return false;
          return true;
        }

        const newAuth = await ctx.prisma.authorizedcategories.create({
          data: {
            listofauthorizedcategories: JSON.stringify([authorizedcategory]),
            utilisateur: { connect: { id: userId } }
          }
        });

        if (!newAuth) return false;

        const statusUpdated = await updateStatus(authorizedcategory);

        if (!statusUpdated) return false;
        return true;
      }
    });
    t.field('removeAuthorizedCategories', {
      type: 'Boolean',
      args: {
        id: stringArg({ required: true }),
        referenceId: requiredStr({})
      },
      resolve: async (_, { id, referenceId }, ctx) => {
        const userId = id;

        const updateStatus = async (referenceid: string) => {
          const res = await ctx.prisma.verificationpieces.updateMany({
            where: { AND: [{ userId }, { referenceid }] },
            data: { status: 'refuse' }
          });
          if (!res) return;
          return res;
        };

        try {
          const authorizedcategories = await ctx.prisma.authorizedcategories.findOne(
            {
              where: { userId },
              select: { listofauthorizedcategories: true }
            }
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
              data: {
                listofauthorizedcategories: JSON.stringify(newArray)
              }
            }
          );
          if (!newAuthorizedcategories) return false;
          const statusUpdated = await updateStatus(referenceId);
          if (!statusUpdated) return false;
          const notificationToken = await ctx.prisma.notificationstoken.findOne(
            {
              where: {
                userid: userId
              },
              select: { token: true }
            }
          );
          notificationToken &&
            notificationToken.token &&
            ctx.sendPushNotification(notificationToken.token, [
              "Suppression d'une autorisation",
              "Une autorisation à une catégorie vient d'être supprimée de votre profil",
              {
                screenToRedirect: 'Reload'
              }
            ]);
          return true;
        } catch (error) {
          throw new Error(`Remove of authorized category impossible, ${error}`);
        }
      }
    });
  }
});
