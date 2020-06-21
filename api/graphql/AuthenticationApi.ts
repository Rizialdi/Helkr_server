import { objectType } from '@nexus/schema';

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
  }
});
