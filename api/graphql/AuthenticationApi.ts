import { objectType, extendType, stringArg } from '@nexus/schema';
import jwt, { Secret } from 'jsonwebtoken';
import { APP_SECRET_CODE } from '../../utils';

exports.STEP_ONE_RESPONSE = objectType({
  name: 'STEP_ONE_RESPONSE',
  definition(t) {
    t.string('id'), t.string('status');
  }
});

exports.STEP_TWO_RESPONSE = objectType({
  name: 'STEP_TWO_RESPONSE',
  definition(t) {
    t.boolean('success');
    t.string('token', { nullable: true });
    t.string('prenom', { nullable: true });
    t.string('nom', { nullable: true });
    t.string('id', { nullable: true });
  }
});

exports.QueryAuthenticationApi = extendType({
  type: 'Query',
  definition(t) {
    t.field('AUTH_STEP_ONE', {
      type: 'STEP_ONE_RESPONSE',
      args: { numero: stringArg({ required: true }) },
      resolve: async (_, { numero }, ctx) => {
        const { id, status } = await ctx.authenticationApi.step_one(numero);
        return { id, status };
      }
    });
    t.field('AUTH_STEP_TWO', {
      type: 'STEP_TWO_RESPONSE',
      args: {
        id: stringArg({ required: true }),
        token: stringArg({ required: true }),
        numero: stringArg({ required: true })
      },
      resolve: async (_, { id, token, numero }, ctx) => {
        const { success } = await ctx.authenticationApi.step_two(id, token);
        if (!success) return { success };

        const potentialUser = await ctx.prisma.utilisateur.findOne({
          where: { numero }
        });

        // If this number is not related to an account
        if (!potentialUser)
          return {
            success,
            token: '',
            nom: '',
            prenom: '',
            id: ''
          };

        // If the user already in the database
        const { id: userId, nom, prenom } = potentialUser;
        const jwtToken = jwt.sign(
          { userId: userId },
          APP_SECRET_CODE as Secret
        );
        return {
          success,
          token: jwtToken,
          nom,
          prenom,
          id: userId
        };
      }
    });
  }
});
