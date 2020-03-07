module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.34.10). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar Long

type Mutation {
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  nom: String!
  prenom: String!
  numero: String!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  nom: String!
  prenom: String!
  numero: String!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  nom_ASC
  nom_DESC
  prenom_ASC
  prenom_DESC
  numero_ASC
  numero_DESC
}

type UserPreviousValues {
  id: ID!
  nom: String!
  prenom: String!
  numero: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  nom: String
  prenom: String
  numero: String
}

input UserUpdateManyMutationInput {
  nom: String
  prenom: String
  numero: String
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  nom: String
  nom_not: String
  nom_in: [String!]
  nom_not_in: [String!]
  nom_lt: String
  nom_lte: String
  nom_gt: String
  nom_gte: String
  nom_contains: String
  nom_not_contains: String
  nom_starts_with: String
  nom_not_starts_with: String
  nom_ends_with: String
  nom_not_ends_with: String
  prenom: String
  prenom_not: String
  prenom_in: [String!]
  prenom_not_in: [String!]
  prenom_lt: String
  prenom_lte: String
  prenom_gt: String
  prenom_gte: String
  prenom_contains: String
  prenom_not_contains: String
  prenom_starts_with: String
  prenom_not_starts_with: String
  prenom_ends_with: String
  prenom_not_ends_with: String
  numero: String
  numero_not: String
  numero_in: [String!]
  numero_not_in: [String!]
  numero_lt: String
  numero_lte: String
  numero_gt: String
  numero_gte: String
  numero_contains: String
  numero_not_contains: String
  numero_starts_with: String
  numero_not_starts_with: String
  numero_ends_with: String
  numero_not_ends_with: String
  AND: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  numero: String
}
`
      }
    