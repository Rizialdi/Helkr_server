import { mergeResolvers } from 'merge-graphql-schemas';

import User from './User';
import Avis from './Avis';
import Moyenne from './Moyenne';
import Offering from './Offering';
import Channel from './Channel';
import Message from './Message';
import AuthenticationApi from './AuthenticationApi';

const resolvers = [
  User,
  Avis,
  Moyenne,
  Offering,
  Channel,
  Message,
  AuthenticationApi
];

export default mergeResolvers(resolvers);