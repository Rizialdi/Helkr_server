
import { mergeResolvers } from 'merge-graphql-schemas'

import User from './User'
import Offering from './Offering'
import Channel from './Channel'
import Message from './Message'

const resolvers = [User, Offering, Channel, Message]

export default mergeResolvers(resolvers)
