import gql from 'graphql-tag';
export default gql`
  type Query {
    twoWFA_step_one(numero: String!): STEP_ONE_RESPONSE
    twoWFA_step_two(id: String!, token: String!): Boolean
  }
  type STEP_ONE_RESPONSE {
    id: String!
    status: String!
  }
`;
