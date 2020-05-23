import { authentication_step_one, authentication_step_two } from '../../utils';

export default {
  Query: {
    twoWFA_step_one: async (_, { numero }, __) => {
      const { id, status } = await authentication_step_one(numero);
      return { id, status };
    },
    twoWFA_step_two: async (_, { id, token }, __) => {
      const { status, errors } = await authentication_step_two(id, token);
      if (errors) return false;
      if (status !== 'verified') return false;
      return true;
    }
  }
};
