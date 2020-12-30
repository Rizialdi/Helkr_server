/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import * as Context from "./context"
import { core } from "@nexus/schema"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    json<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    model: NexusPrisma<TypeName, 'model'>
    crud: any
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ReferenceidUserIdIdCompoundUniqueInput: { // input type
    id: string; // String!
    referenceid: string; // String!
    userId: string; // String!
  }
  avisWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  offeringWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  uploadImageType: { // input type
    name: string; // String!
    type: string; // String!
    uri: string; // String!
  }
  utilisateurWhereUniqueInput: { // input type
    id?: string | null; // String
    numero?: string | null; // String
  }
  verificationpiecesWhereUniqueInput: { // input type
    referenceid_userId_id?: NexusGenInputs['ReferenceidUserIdIdCompoundUniqueInput'] | null; // ReferenceidUserIdIdCompoundUniqueInput
    userId?: string | null; // String
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  AddJobberTagResponse: { // root type
    added: boolean; // Boolean!
    max: boolean; // Boolean!
  }
  AuthPayload: { // root type
    token: string; // String!
    user?: NexusGenRootTypes['utilisateur'] | null; // utilisateur
  }
  CandidateToOfferingSuccess: { // root type
    success: boolean; // Boolean!
  }
  Mutation: {};
  OfferingAugmented: { // root type
    endCursor: string; // String!
    hasNext: boolean; // Boolean!
    offerings?: NexusGenRootTypes['offering'][] | null; // [offering!]
  }
  PayLoad: { // root type
    endCursor: string; // String!
    hasNext: boolean; // Boolean!
    users?: NexusGenRootTypes['utilisateur'][] | null; // [utilisateur!]
  }
  Query: {};
  STEP_ONE_RESPONSE: { // root type
    id: string; // String!
    status: string; // String!
  }
  STEP_TWO_RESPONSE: { // root type
    id?: string | null; // String
    nom?: string | null; // String
    prenom?: string | null; // String
    success: boolean; // Boolean!
    token?: string | null; // String
  }
  Stats: { // root type
    average: number; // Float!
    done: number; // Int!
    proposed: number; // Int!
  }
  Subscription: {};
  authorizedcategories: { // root type
    id: string; // String!
    listofauthorizedcategories?: any | null; // Json
    userId?: string | null; // String
  }
  avis: { // root type
    comment: string; // String!
    createdAt: any; // DateTime!
    id: string; // String!
    score: number; // Int!
  }
  demande: { // root type
    createdAt: any; // DateTime!
    id: string; // String!
    message: string; // String!
    receivedById?: string | null; // String
    sentById?: string | null; // String
  }
  moyenne: { // root type
    id: string; // String!
    moyenne: number; // Float!
    userId: string; // String!
  }
  notificationstoken: { // root type
    id: string; // String!
    token?: string | null; // String
    userid?: string | null; // String
  }
  offering: { // root type
    category: string; // String!
    completed: boolean; // Boolean!
    createdAt: any; // DateTime!
    description: string; // String!
    eventday?: string | null; // String
    id: string; // String!
    preferreddays: string[]; // [String!]!
    status?: string | null; // String
    type: string; // String!
    updatedAt: any; // DateTime!
  }
  propositionToOffering: { // root type
    candidateUsername: string; // String!
    descriptionPrestataire?: string | null; // String
    message: string; // String!
    priceRange: string; // String!
  }
  tags: { // root type
    id: string; // String!
    tags: string; // String!
    userid?: string | null; // String
  }
  updateAppliedToType: { // root type
    id: string; // String!
    status: string; // String!
  }
  updateSelectedEventDay: { // root type
    eventday: string; // String!
    offeringId: string; // String!
  }
  utilisateur: { // root type
    address?: string | null; // String
    avatar?: string | null; // String
    description?: string | null; // String
    id: string; // String!
    nom: string; // String!
    numero: string; // String!
    prenom: string; // String!
    professional: boolean; // Boolean!
    verified: boolean; // Boolean!
  }
  verificationpieces: { // root type
    id: string; // String!
    listofpieces?: any | null; // Json
    referenceid: string; // String!
    status?: string | null; // String
    userId: string; // String!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
  JSON: any;
  Json: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  ReferenceidUserIdIdCompoundUniqueInput: NexusGenInputs['ReferenceidUserIdIdCompoundUniqueInput'];
  avisWhereUniqueInput: NexusGenInputs['avisWhereUniqueInput'];
  offeringWhereUniqueInput: NexusGenInputs['offeringWhereUniqueInput'];
  uploadImageType: NexusGenInputs['uploadImageType'];
  utilisateurWhereUniqueInput: NexusGenInputs['utilisateurWhereUniqueInput'];
  verificationpiecesWhereUniqueInput: NexusGenInputs['verificationpiecesWhereUniqueInput'];
}

export interface NexusGenFieldTypes {
  AddJobberTagResponse: { // field return type
    added: boolean; // Boolean!
    max: boolean; // Boolean!
  }
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['utilisateur'] | null; // utilisateur
  }
  CandidateToOfferingSuccess: { // field return type
    success: boolean; // Boolean!
  }
  Mutation: { // field return type
    addAuthorizedCategories: boolean; // Boolean!
    addOffering: any; // JSON!
    addressUpdate: boolean; // Boolean!
    addVerificationpieces: boolean; // Boolean!
    avatarUpload: boolean; // Boolean!
    candidateToOffering: NexusGenRootTypes['CandidateToOfferingSuccess']; // CandidateToOfferingSuccess!
    chooseCandidate: boolean; // Boolean!
    chooseEventDay: boolean; // Boolean!
    completeOffering: boolean; // Boolean!
    createAvis: boolean; // Boolean!
    createDemande: boolean; // Boolean!
    deleteDemande: boolean; // Boolean!
    deleteOffering: boolean; // Boolean!
    descriptionUpdate: boolean; // Boolean!
    notificationsTokenUpdate: boolean; // Boolean!
    registerUser: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    removeAuthorizedCategories: boolean; // Boolean!
    statusChangeToDenyAuthorization: boolean; // Boolean!
    tagsAddJobber: NexusGenRootTypes['AddJobberTagResponse']; // AddJobberTagResponse!
    tagsUpdate: boolean; // Boolean!
    updateOffering: boolean; // Boolean!
  }
  OfferingAugmented: { // field return type
    endCursor: string; // String!
    hasNext: boolean; // Boolean!
    offerings: NexusGenRootTypes['offering'][] | null; // [offering!]
  }
  PayLoad: { // field return type
    endCursor: string; // String!
    hasNext: boolean; // Boolean!
    users: NexusGenRootTypes['utilisateur'][] | null; // [utilisateur!]
  }
  Query: { // field return type
    allOfferings: NexusGenRootTypes['offering'][]; // [offering!]!
    allUsersToken: NexusGenRootTypes['notificationstoken'][]; // [notificationstoken!]!
    AUTH_STEP_ONE: NexusGenRootTypes['STEP_ONE_RESPONSE']; // STEP_ONE_RESPONSE!
    AUTH_STEP_TWO: NexusGenRootTypes['STEP_TWO_RESPONSE']; // STEP_TWO_RESPONSE!
    demandes: NexusGenRootTypes['demande'][]; // [demande!]!
    demandesenvoyees: NexusGenRootTypes['demande'][]; // [demande!]!
    demandesrecues: NexusGenRootTypes['demande'][]; // [demande!]!
    getAuthorizedCategories: NexusGenRootTypes['authorizedcategories']; // authorizedcategories!
    getAvisUser: NexusGenRootTypes['avis'][]; // [avis!]!
    getSendVerificationPiecesReferenceIdsAndStatus: string; // String!
    getUserInfo: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    getUserStats: NexusGenRootTypes['Stats']; // Stats!
    getVerificationPieces: NexusGenRootTypes['verificationpieces']; // verificationpieces!
    incompleteOfferings: NexusGenRootTypes['OfferingAugmented']; // OfferingAugmented!
    isCandidateTo: NexusGenRootTypes['OfferingAugmented']; // OfferingAugmented!
    myIncompleteOffering: NexusGenRootTypes['OfferingAugmented']; // OfferingAugmented!
    myIncompleteOfferingWithCandidates: NexusGenRootTypes['OfferingAugmented']; // OfferingAugmented!
    offeringById: NexusGenRootTypes['offering']; // offering!
    offeringsUser: NexusGenRootTypes['offering'][]; // [offering!]!
    propositionToOfferingDetails: NexusGenRootTypes['propositionToOffering']; // propositionToOffering!
    userById: NexusGenRootTypes['utilisateur'] | null; // utilisateur
    users: NexusGenRootTypes['utilisateur'][]; // [utilisateur!]!
    usersPagination: NexusGenRootTypes['PayLoad'] | null; // PayLoad
  }
  STEP_ONE_RESPONSE: { // field return type
    id: string; // String!
    status: string; // String!
  }
  STEP_TWO_RESPONSE: { // field return type
    id: string | null; // String
    nom: string | null; // String
    prenom: string | null; // String
    success: boolean; // Boolean!
    token: string | null; // String
  }
  Stats: { // field return type
    average: number; // Float!
    done: number; // Int!
    proposed: number; // Int!
  }
  Subscription: { // field return type
    newAvis: NexusGenRootTypes['avis']; // avis!
    newDemande: NexusGenRootTypes['demande']; // demande!
    onOfferingAdded: NexusGenRootTypes['offering']; // offering!
    updateAppliedTo: NexusGenRootTypes['updateAppliedToType']; // updateAppliedToType!
    updatedEventDay: NexusGenRootTypes['updateSelectedEventDay']; // updateSelectedEventDay!
  }
  authorizedcategories: { // field return type
    id: string; // String!
    listofauthorizedcategories: any | null; // Json
    userId: string | null; // String
    utilisateur: NexusGenRootTypes['utilisateur'] | null; // utilisateur
  }
  avis: { // field return type
    comment: string; // String!
    createdAt: any; // DateTime!
    id: string; // String!
    offering: NexusGenRootTypes['offering']; // offering!
    score: number; // Int!
    scored: NexusGenRootTypes['utilisateur']; // utilisateur!
    scorer: NexusGenRootTypes['utilisateur']; // utilisateur!
  }
  demande: { // field return type
    createdAt: any; // DateTime!
    id: string; // String!
    message: string; // String!
    receivedById: string | null; // String
    sentBy: NexusGenRootTypes['utilisateur'] | null; // utilisateur
    sentById: string | null; // String
  }
  moyenne: { // field return type
    id: string; // String!
    moyenne: number; // Float!
    userId: string; // String!
    utilisateur: NexusGenRootTypes['utilisateur']; // utilisateur!
  }
  notificationstoken: { // field return type
    id: string; // String!
    token: string | null; // String
    userid: string | null; // String
    utilisateur: NexusGenRootTypes['utilisateur'] | null; // utilisateur
  }
  offering: { // field return type
    author: NexusGenRootTypes['utilisateur']; // utilisateur!
    avis: NexusGenRootTypes['avis'][]; // [avis!]!
    candidates: NexusGenRootTypes['utilisateur'][]; // [utilisateur!]!
    category: string; // String!
    completed: boolean; // Boolean!
    createdAt: any; // DateTime!
    description: string; // String!
    details: any; // JSON!
    eventday: string | null; // String
    id: string; // String!
    preferreddays: string[]; // [String!]!
    referenceId: string | null; // String
    selectedCandidate: NexusGenRootTypes['utilisateur'] | null; // utilisateur
    status: string | null; // String
    type: string; // String!
    updatedAt: any; // DateTime!
  }
  propositionToOffering: { // field return type
    candidateUsername: string; // String!
    descriptionPrestataire: string | null; // String
    message: string; // String!
    priceRange: string; // String!
  }
  tags: { // field return type
    id: string; // String!
    tags: string; // String!
    userid: string | null; // String
    utilisateur: NexusGenRootTypes['utilisateur'] | null; // utilisateur
  }
  updateAppliedToType: { // field return type
    id: string; // String!
    status: string; // String!
  }
  updateSelectedEventDay: { // field return type
    eventday: string; // String!
    offeringId: string; // String!
  }
  utilisateur: { // field return type
    address: string | null; // String
    avatar: string | null; // String
    avisgave: NexusGenRootTypes['avis'][]; // [avis!]!
    avisreceived: NexusGenRootTypes['avis'][]; // [avis!]!
    completedofferings: NexusGenRootTypes['offering'][]; // [offering!]!
    description: string | null; // String
    id: string; // String!
    moyenne: number; // Int!
    nom: string; // String!
    numero: string; // String!
    offerings: NexusGenRootTypes['offering'][]; // [offering!]!
    prenom: string; // String!
    professional: boolean; // Boolean!
    tags: string[] | null; // [String!]
    verificationpieces: NexusGenRootTypes['verificationpieces'][]; // [verificationpieces!]!
    verified: boolean; // Boolean!
  }
  verificationpieces: { // field return type
    id: string; // String!
    listofpieces: any | null; // Json
    referenceid: string; // String!
    status: string | null; // String
    userId: string; // String!
    utilisateur: NexusGenRootTypes['utilisateur']; // utilisateur!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addAuthorizedCategories: { // args
      authorizedcategory: string; // String!
      id: string; // String!
    }
    addOffering: { // args
      category: string; // String!
      description: string; // String!
      details: string; // String!
      referenceId: string; // String!
      type: string; // String!
    }
    addressUpdate: { // args
      text: string; // String!
    }
    addVerificationpieces: { // args
      id?: string | null; // String
      listofpieces: string; // String!
      referenceId: string; // String!
    }
    avatarUpload: { // args
      file?: NexusGenInputs['uploadImageType'] | null; // uploadImageType
    }
    candidateToOffering: { // args
      id: string; // String!
      message: string; // String!
      priceRange: string; // String!
    }
    chooseCandidate: { // args
      candidateId: string; // String!
      id: string; // String!
      preferreddays: string[]; // [String!]!
    }
    chooseEventDay: { // args
      id: string; // String!
      timestamp: string; // String!
    }
    completeOffering: { // args
      completedById: string; // String!
      id: string; // String!
    }
    createAvis: { // args
      comment: string; // String!
      offeringId: string; // String!
      score: number; // Int!
      scoredId: string; // String!
    }
    createDemande: { // args
      message: string; // String!
      recipient: string; // String!
    }
    deleteDemande: { // args
      id: string; // String!
    }
    deleteOffering: { // args
      id: string; // String!
    }
    descriptionUpdate: { // args
      text: string; // String!
    }
    notificationsTokenUpdate: { // args
      token: string; // String!
    }
    registerUser: { // args
      address: string; // String!
      nom: string; // String!
      numero: string; // String!
      prenom: string; // String!
    }
    removeAuthorizedCategories: { // args
      id: string; // String!
      referenceId: string; // String!
    }
    statusChangeToDenyAuthorization: { // args
      id: string; // String!
      referenceId: string; // String!
    }
    tagsAddJobber: { // args
      tag: string; // String!
    }
    tagsUpdate: { // args
      tags: string[]; // [String!]!
    }
    updateOffering: { // args
      description: string; // String!
      id: string; // String!
    }
  }
  Query: {
    allOfferings: { // args
      filters: string[]; // [String!]!
    }
    AUTH_STEP_ONE: { // args
      numero: string; // String!
    }
    AUTH_STEP_TWO: { // args
      id: string; // String!
      numero: string; // String!
      token: string; // String!
    }
    getAuthorizedCategories: { // args
      id?: string | null; // String
    }
    getAvisUser: { // args
      userId: string; // String!
    }
    getSendVerificationPiecesReferenceIdsAndStatus: { // args
      id?: string | null; // String
    }
    getUserInfo: { // args
      numero: string; // String!
    }
    getUserStats: { // args
      id: string; // String!
    }
    getVerificationPieces: { // args
      id?: string | null; // String
    }
    incompleteOfferings: { // args
      filters: string[]; // [String!]!
      lastCursorId?: string | null; // String
      take: number; // Int!
    }
    isCandidateTo: { // args
      lastCursorId?: string | null; // String
      take: number; // Int!
    }
    myIncompleteOffering: { // args
      lastCursorId?: string | null; // String
      take: number; // Int!
    }
    myIncompleteOfferingWithCandidates: { // args
      lastCursorId?: string | null; // String
      take: number; // Int!
    }
    offeringById: { // args
      id: string; // String!
    }
    offeringsUser: { // args
      numero: string; // String!
    }
    propositionToOfferingDetails: { // args
      offeringId: string; // String!
      userId: string; // String!
    }
    userById: { // args
      id: string; // String!
    }
    usersPagination: { // args
      lastCursorId?: string | null; // String
      take: number; // Int!
    }
  }
  Subscription: {
    newAvis: { // args
      userId: string; // String!
    }
    newDemande: { // args
      recipientId: string; // String!
    }
    onOfferingAdded: { // args
      tags: string[]; // [String!]!
    }
    updateAppliedTo: { // args
      userId: string; // String!
    }
    updatedEventDay: { // args
      userId: string; // String!
    }
  }
  offering: {
    avis: { // args
      after?: NexusGenInputs['avisWhereUniqueInput'] | null; // avisWhereUniqueInput
      before?: NexusGenInputs['avisWhereUniqueInput'] | null; // avisWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    candidates: { // args
      after?: NexusGenInputs['utilisateurWhereUniqueInput'] | null; // utilisateurWhereUniqueInput
      before?: NexusGenInputs['utilisateurWhereUniqueInput'] | null; // utilisateurWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
  utilisateur: {
    avisgave: { // args
      after?: NexusGenInputs['avisWhereUniqueInput'] | null; // avisWhereUniqueInput
      before?: NexusGenInputs['avisWhereUniqueInput'] | null; // avisWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    avisreceived: { // args
      after?: NexusGenInputs['avisWhereUniqueInput'] | null; // avisWhereUniqueInput
      before?: NexusGenInputs['avisWhereUniqueInput'] | null; // avisWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    completedofferings: { // args
      after?: NexusGenInputs['offeringWhereUniqueInput'] | null; // offeringWhereUniqueInput
      before?: NexusGenInputs['offeringWhereUniqueInput'] | null; // offeringWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    offerings: { // args
      after?: NexusGenInputs['offeringWhereUniqueInput'] | null; // offeringWhereUniqueInput
      before?: NexusGenInputs['offeringWhereUniqueInput'] | null; // offeringWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    verificationpieces: { // args
      after?: NexusGenInputs['verificationpiecesWhereUniqueInput'] | null; // verificationpiecesWhereUniqueInput
      before?: NexusGenInputs['verificationpiecesWhereUniqueInput'] | null; // verificationpiecesWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AddJobberTagResponse" | "AuthPayload" | "CandidateToOfferingSuccess" | "Mutation" | "OfferingAugmented" | "PayLoad" | "Query" | "STEP_ONE_RESPONSE" | "STEP_TWO_RESPONSE" | "Stats" | "Subscription" | "authorizedcategories" | "avis" | "demande" | "moyenne" | "notificationstoken" | "offering" | "propositionToOffering" | "tags" | "updateAppliedToType" | "updateSelectedEventDay" | "utilisateur" | "verificationpieces";

export type NexusGenInputNames = "ReferenceidUserIdIdCompoundUniqueInput" | "avisWhereUniqueInput" | "offeringWhereUniqueInput" | "uploadImageType" | "utilisateurWhereUniqueInput" | "verificationpiecesWhereUniqueInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "JSON" | "Json" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: Context.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}