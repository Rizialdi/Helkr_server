import gql from 'graphql-tag';
export default gql`
  type Query {
    twoWFA_step_one(numero: String): STEP_ONE_RESPONSE
    twoWFA_step_two(id: String!, token: String!): STEP_TWO_RESPONSE
  }
  type STEP_ONE_RESPONSE {
    id: String!
    status: String!
  }
  type STEP_TWO_RESPONSE {
    success: Boolean!
  }
`;
