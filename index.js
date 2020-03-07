import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphQL'
import cors from 'cors'
import { prisma } from './prisma/generated/prisma-client'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: request => ({
    ...request,
    prisma
  }),
  introspection: true,
  playground: !process.env.APP_ENV === 'prod'
})

const app = express()
// TODO: to remove when in production
app.use(cors())

app.disable('x-powered-by')
app.get('/', function (req, res) {
  res.send('hello world baby')
})

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log('🚀 Server ready at http://localhost:4000')
)
