import { makeSchema } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
import * as types from './graphql';
import path from 'path';

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, '../helpkr.graphql'),
    typegen: path.join(__dirname, './helpkr-typegen.ts')
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma'
      },
      {
        source: require.resolve('./context'),
        alias: 'Context'
      }
    ],
    contextType: 'Context.Context'
  },
  plugins: [nexusPrismaPlugin()]
});
