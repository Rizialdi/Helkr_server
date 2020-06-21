import { objectType } from '@nexus/schema';

exports.Channel = objectType({
  name: 'Channel',
  definition(t) {
    t.string('id'),
      t.list.field('messages', {
        type: 'Message',
        nullable: false,
        description: 'Messages belonging to a specific channel'
      });
    t.list.field('users', {
      type: 'User',
      nullable: false,
      description: 'Users contributing in a specific channel'
    });
  }
});
