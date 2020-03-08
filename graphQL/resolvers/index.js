
import { mergeResolvers } from 'merge-graphql-schemas'

import User from './User'
import Offerings from './Offerings'

const resolvers = [User, Offerings]

export default mergeResolvers(resolvers)
