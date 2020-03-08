module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.34.10). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateOffering {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Long

type Mutation {
  createOffering(data: OfferingCreateInput!): Offering!
  updateOffering(data: OfferingUpdateInput!, where: OfferingWhereUniqueInput!): Offering
  updateManyOfferings(data: OfferingUpdateManyMutationInput!, where: OfferingWhereInput): BatchPayload!
  upsertOffering(where: OfferingWhereUniqueInput!, create: OfferingCreateInput!, update: OfferingUpdateInput!): Offering!
  deleteOffering(where: OfferingWhereUniqueInput!): Offering
  deleteManyOfferings(where: OfferingWhereInput): BatchPayload!
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

type Offering {
  id: ID!
  type: String!
  category: String!
  description: String!
  author: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type OfferingConnection {
  pageInfo: PageInfo!
  edges: [OfferingEdge]!
  aggregate: AggregateOffering!
}

input OfferingCreateInput {
  id: ID
  type: String!
  category: String!
  description: String!
  author: UserCreateOneWithoutOfferingsInput!
}

input OfferingCreateManyWithoutAuthorInput {
  create: [OfferingCreateWithoutAuthorInput!]
  connect: [OfferingWhereUniqueInput!]
}

input OfferingCreateWithoutAuthorInput {
  id: ID
  type: String!
  category: String!
  description: String!
}

type OfferingEdge {
  node: Offering!
  cursor: String!
}

enum OfferingOrderByInput {
  id_ASC
  id_DESC
  type_ASC
  type_DESC
  category_ASC
  category_DESC
  description_ASC
  description_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type OfferingPreviousValues {
  id: ID!
  type: String!
  category: String!
  description: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input OfferingScalarWhereInput {
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
  type: String
  type_not: String
  type_in: [String!]
  type_not_in: [String!]
  type_lt: String
  type_lte: String
  type_gt: String
  type_gte: String
  type_contains: String
  type_not_contains: String
  type_starts_with: String
  type_not_starts_with: String
  type_ends_with: String
  type_not_ends_with: String
  category: String
  category_not: String
  category_in: [String!]
  category_not_in: [String!]
  category_lt: String
  category_lte: String
  category_gt: String
  category_gte: String
  category_contains: String
  category_not_contains: String
  category_starts_with: String
  category_not_starts_with: String
  category_ends_with: String
  category_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [OfferingScalarWhereInput!]
  OR: [OfferingScalarWhereInput!]
  NOT: [OfferingScalarWhereInput!]
}

type OfferingSubscriptionPayload {
  mutation: MutationType!
  node: Offering
  updatedFields: [String!]
  previousValues: OfferingPreviousValues
}

input OfferingSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: OfferingWhereInput
  AND: [OfferingSubscriptionWhereInput!]
}

input OfferingUpdateInput {
  type: String
  category: String
  description: String
  author: UserUpdateOneRequiredWithoutOfferingsInput
}

input OfferingUpdateManyDataInput {
  type: String
  category: String
  description: String
}

input OfferingUpdateManyMutationInput {
  type: String
  category: String
  description: String
}

input OfferingUpdateManyWithoutAuthorInput {
  create: [OfferingCreateWithoutAuthorInput!]
  delete: [OfferingWhereUniqueInput!]
  connect: [OfferingWhereUniqueInput!]
  set: [OfferingWhereUniqueInput!]
  disconnect: [OfferingWhereUniqueInput!]
  update: [OfferingUpdateWithWhereUniqueWithoutAuthorInput!]
  upsert: [OfferingUpsertWithWhereUniqueWithoutAuthorInput!]
  deleteMany: [OfferingScalarWhereInput!]
  updateMany: [OfferingUpdateManyWithWhereNestedInput!]
}

input OfferingUpdateManyWithWhereNestedInput {
  where: OfferingScalarWhereInput!
  data: OfferingUpdateManyDataInput!
}

input OfferingUpdateWithoutAuthorDataInput {
  type: String
  category: String
  description: String
}

input OfferingUpdateWithWhereUniqueWithoutAuthorInput {
  where: OfferingWhereUniqueInput!
  data: OfferingUpdateWithoutAuthorDataInput!
}

input OfferingUpsertWithWhereUniqueWithoutAuthorInput {
  where: OfferingWhereUniqueInput!
  update: OfferingUpdateWithoutAuthorDataInput!
  create: OfferingCreateWithoutAuthorInput!
}

input OfferingWhereInput {
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
  type: String
  type_not: String
  type_in: [String!]
  type_not_in: [String!]
  type_lt: String
  type_lte: String
  type_gt: String
  type_gte: String
  type_contains: String
  type_not_contains: String
  type_starts_with: String
  type_not_starts_with: String
  type_ends_with: String
  type_not_ends_with: String
  category: String
  category_not: String
  category_in: [String!]
  category_not_in: [String!]
  category_lt: String
  category_lte: String
  category_gt: String
  category_gte: String
  category_contains: String
  category_not_contains: String
  category_starts_with: String
  category_not_starts_with: String
  category_ends_with: String
  category_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  author: UserWhereInput
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [OfferingWhereInput!]
}

input OfferingWhereUniqueInput {
  id: ID
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  offering(where: OfferingWhereUniqueInput!): Offering
  offerings(where: OfferingWhereInput, orderBy: OfferingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Offering]!
  offeringsConnection(where: OfferingWhereInput, orderBy: OfferingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): OfferingConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  offering(where: OfferingSubscriptionWhereInput): OfferingSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  nom: String!
  prenom: String!
  numero: String!
  createdAt: DateTime!
  offerings(where: OfferingWhereInput, orderBy: OfferingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Offering!]
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
  offerings: OfferingCreateManyWithoutAuthorInput
}

input UserCreateOneWithoutOfferingsInput {
  create: UserCreateWithoutOfferingsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutOfferingsInput {
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
  createdAt_ASC
  createdAt_DESC
}

type UserPreviousValues {
  id: ID!
  nom: String!
  prenom: String!
  numero: String!
  createdAt: DateTime!
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
  offerings: OfferingUpdateManyWithoutAuthorInput
}

input UserUpdateManyMutationInput {
  nom: String
  prenom: String
  numero: String
}

input UserUpdateOneRequiredWithoutOfferingsInput {
  create: UserCreateWithoutOfferingsInput
  update: UserUpdateWithoutOfferingsDataInput
  upsert: UserUpsertWithoutOfferingsInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutOfferingsDataInput {
  nom: String
  prenom: String
  numero: String
}

input UserUpsertWithoutOfferingsInput {
  update: UserUpdateWithoutOfferingsDataInput!
  create: UserCreateWithoutOfferingsInput!
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
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  offerings_some: OfferingWhereInput
  AND: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  numero: String
}
`
      }
    