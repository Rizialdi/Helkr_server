import cors from 'cors';
import bodyParser from 'body-parser';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { typeDefs, resolvers } from './graphQL';
import { PrismaClient } from '@prisma/client';
import { processUpload } from './utils';

const prisma = new PrismaClient();
const pubsub = new PubSub();
const fetch = async () => {
  const bb = await prisma.offering.findMany({
    where: {
      AND: [
        { completed: { equals: false } },
        {
          authorId: { equals: 'ckb9svn8p00000ip99ubjoc01' }
        },
        { candidates: { every: { id: { equals: null } } } }
      ]
    },
    include: { candidates: true }
  });
  console.log('data', bb);
};

//fetch();
const graphqlserver = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (request) => ({
    ...request,
    prisma,
    pubsub,
    processUpload
  }),
  //@ts-ignore
  introspection: true
});

// TODO: to remove when in production
graphqlserver.express.use(cors());
// parse application/x-www-form-urlencoded
graphqlserver.express.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
graphqlserver.express.use(bodyParser.json({ limit: '10mb' }));

graphqlserver.express.disable('x-powered-by');

graphqlserver.start({ port: 4000 }, () =>
  console.log('🚀 Server ready at http://localhost:4000')
);
