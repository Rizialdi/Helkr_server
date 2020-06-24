import cors from 'cors';
import bodyParser from 'body-parser';
import { GraphQLServer } from 'graphql-yoga';
import { createContext } from './context';
import { schema } from './schema';

const playground = process.env.NODE_ENV === 'dev' ? '/' : false;
const port = process.env.PORT || '4000';

// const fetch = async () => {};
// //fetch();

const graphqlserver = new GraphQLServer({
  schema,
  context: createContext
});

graphqlserver.express.use(cors());
graphqlserver.express.use(bodyParser.urlencoded({ extended: true }));
graphqlserver.express.use(bodyParser.json({ limit: '10mb' }));

graphqlserver.express.disable('x-powered-by');

//TODO { port, playground }
graphqlserver.start({ port, playground: '/' }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`)
);
