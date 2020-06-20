import gql from 'graphql-tag';

export default gql`
  type Query {
    getMoyenneUser(userId: String!): Moyenne!
  }
  type Moyenne {
    id: ID!
    user: User!
    moyene: Float!
    realMoyenne: Float!
  }
`;
