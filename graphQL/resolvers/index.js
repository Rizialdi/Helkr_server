import { mergeResolvers } from 'merge-graphql-schemas';

import User from './User';
import Avis from './Avis';
import Moyenne from './Moyenne';
import Offering from './Offering';
import Channel from './Channel';
import Message from './Message';

const resolvers = [User, Avis, Moyenne, Offering, Channel, Message];

export default mergeResolvers(resolvers);
