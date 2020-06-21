import { objectType } from '@nexus/schema';

exports.Moyenne = objectType({
  name: 'Moyenne',
  definition(t) {
    t.string('id'),
      t.field('user', {
        type: 'User',
        nullable: false,
        description: 'mark of a specific user in the platform'
      });
    t.float('moyenne');
    t.float('realMoyenne');
  }
});
