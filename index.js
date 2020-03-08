import { GraphQLServer } from 'graphql-yoga'
import { typeDefs, resolvers } from './graphQL'
import cors from 'cors'
import { prisma } from './prisma/generated/prisma-client'

const graphqlserver = new GraphQLServer({
  typeDefs,
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
})

// TODO: to remove when in production
graphqlserver.use(cors())

graphqlserver.express.disable('x-powered-by')

graphqlserver.start({ port: 4000 }, () =>
  console.log('🚀 Server ready at http://localhost:4000')
)
