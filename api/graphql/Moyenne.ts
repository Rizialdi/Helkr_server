import { objectType, extendType, stringArg } from '@nexus/schema';

exports.Moyenne = objectType({
  name: 'moyenne',
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.moyenne();
    t.model.utilisateur();
  }
});
