import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphQL'
import { IN_PROD } from './config'
import cors from 'cors'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: !IN_PROD
})

const app = express()
// TODO: to remove when in production
app.use(cors())

app.disable('x-powered-by')
app.get('/', function (req, res) {
  res.send('hello world baby')
})

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://localhost:27017',
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
