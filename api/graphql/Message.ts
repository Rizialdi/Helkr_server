import { objectType } from '@nexus/schema';

exports.Message = objectType({
  name: 'Message',
  definition(t) {
    t.string('id'),
      t.string('text'),
      t.field('sentBy', {
        type: 'User',
        nullable: false,
        description: 'User who sent a specific message text'
      }),
      t.field('channel', {
        type: 'Channel',
        nullable: false,
        description: 'Channel in which a specific message text is delivered'
      }),
      t.string('createdAt');
  }
});
