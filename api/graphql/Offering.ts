import { objectType } from '@nexus/schema';

exports.Offering = objectType({
  name: 'Offering',
  definition(t) {
    t.string('id');
    t.string('type');
    t.field('author', {
      type: 'User',
      nullable: false,
      description: 'The author of an offer'
    });
    t.string('createdAt');
    t.field('completedBy', {
      type: 'User',
      nullable: false,
      description: 'The user who completed an offer'
    });
    t.field('selectedCandidate', {
      type: 'User',
      nullable: false,
      description: 'The user choosed to complete an offer'
    });
    t.string('details', { nullable: false });
    t.string('category', { nullable: false });
    t.list.field('candidates', {
      type: 'User',
      description: 'List of candidates to an offer'
    });
    t.boolean('completed');
    t.string('description');
    t.list.field('avis', {
      type: 'Avis',
      description: 'List of all the commentaries on an offering'
    });
  }
});
