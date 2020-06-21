import cors from 'cors';
import bodyParser from 'body-parser';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import { processUpload } from '../utils';
import { makeSchema } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
import * as types from './graphql';
import path from 'path';

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, '../helpkr.graphql'),
    typegen: path.join(__dirname, './helpkr-typegen.ts')
  },
  plugins: [nexusPrismaPlugin()],
  prettierConfig: path.join(__dirname, '../.prettierrc')
});

const playground = process.env.NODE_ENV === 'dev' ? '/' : false;
const port = process.env.PORT || '4000';
const db = new PrismaClient();
const pubsub = new PubSub();
const fetch = async () => {};

//fetch();
const graphqlserver = new GraphQLServer({
  schema,
  context: request => ({
    ...request,
    db,
    pubsub,
    processUpload
  })
});

graphqlserver.express.use(cors());
graphqlserver.express.use(bodyParser.urlencoded({ extended: true }));
graphqlserver.express.use(bodyParser.json({ limit: '10mb' }));

graphqlserver.express.disable('x-powered-by');

graphqlserver.start({ port, playground }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`)
);
