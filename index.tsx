import cors from 'cors';
import bodyParser from 'body-parser';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { typeDefs, resolvers } from './graphQL';
import { PrismaClient } from '@prisma/client';

require('custom-env').env('dev');

const { MESSAGEBIRD_API_KEY, NUMERO } = process.env;
const messagebird = require('messagebird')(MESSAGEBIRD_API_KEY);
const prisma = new PrismaClient();
const pubsub = new PubSub();

const graphqlserver = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (request) => ({
    ...request,
    prisma,
    pubsub
  }),
  //@ts-ignore
  introspection: true
});

// TODO: to remove when in production
graphqlserver.express.use(cors());
// parse application/x-www-form-urlencoded
graphqlserver.express.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
graphqlserver.express.use(bodyParser.json());

graphqlserver.express.disable('x-powered-by');

graphqlserver.express.post('/api/v1/register-step1', (req, res) => {
  let { numero } = req.body;
  // TODO change this number
  numero = `${NUMERO}`;
  messagebird.verify.create(
    numero,
    {
      originator: 'Yoko App',
      template: 'Votre code de vérification est %token'
    },
    (error, response) => {
      if (error) return res.send(error);
      return res.send(response);
    }
  );
});

graphqlserver.express.post('/api/v1/register-step2', (req, res) => {
  const { id, token } = req.body;
  messagebird.verify.verify(id, token, (error, response) => {
    if (error) return res.send(error);
    return res.send(response);
  });
});

graphqlserver.start({ port: 4000 }, () =>
  console.log('🚀 Server ready at http://localhost:4000')
);
