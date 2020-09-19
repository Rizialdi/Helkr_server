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
  channelWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  messageWhereUniqueInput: { // input type
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
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['utilisateur']; // utilisateur!
  }
  CandidateToOfferingSuccess: { // root type
    success: boolean; // Boolean!
  }
  Mutation: {};
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
  channel: { // root type
    createdAt: any; // DateTime!
    id: string; // String!
  }
  createChannel: { // root type
    channel: NexusGenRootTypes['channel']; // channel!
    success: boolean; // Boolean!
  }
  message: { // root type
    channelId?: string | null; // String
    createdAt: any; // DateTime!
    id: string; // String!
    sentById?: string | null; // String
    text: string; // String!
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
  channelWhereUniqueInput: NexusGenInputs['channelWhereUniqueInput'];
  messageWhereUniqueInput: NexusGenInputs['messageWhereUniqueInput'];
  offeringWhereUniqueInput: NexusGenInputs['offeringWhereUniqueInput'];
  uploadImageType: NexusGenInputs['uploadImageType'];
  utilisateurWhereUniqueInput: NexusGenInputs['utilisateurWhereUniqueInput'];
  verificationpiecesWhereUniqueInput: NexusGenInputs['verificationpiecesWhereUniqueInput'];
}

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['utilisateur']; // utilisateur!
  }
  CandidateToOfferingSuccess: { // field return type
    success: boolean; // Boolean!
  }
  Mutation: { // field return type
    addAuthorizedCategories: boolean; // Boolean!
    addOffering: boolean; // Boolean!
    addressUpdate: boolean; // Boolean!
    addVerificationpieces: boolean; // Boolean!
    avatarUpload: boolean; // Boolean!
    candidateToOffering: NexusGenRootTypes['CandidateToOfferingSuccess']; // CandidateToOfferingSuccess!
    chooseCandidate: boolean; // Boolean!
    chooseEventDay: boolean; // Boolean!
    completeOffering: boolean; // Boolean!
    createAvis: boolean; // Boolean!
    createChannel: NexusGenRootTypes['createChannel']; // createChannel!
    createMessage: boolean; // Boolean!
    deleteOffering: boolean; // Boolean!
    descriptionUpdate: boolean; // Boolean!
    notificationsTokenUpdate: boolean; // Boolean!
    registerUser: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    removeAuthorizedCategories: boolean; // Boolean!
    statusChangeToDenyAuthorization: boolean; // Boolean!
    tagsUpdate: boolean; // Boolean!
    updateOffering: boolean; // Boolean!
  }
  Query: { // field return type
    allChatsAndMessages: NexusGenRootTypes['channel'][]; // [channel!]!
    allOfferings: NexusGenRootTypes['offering'][]; // [offering!]!
    allUsersToken: NexusGenRootTypes['notificationstoken'][]; // [notificationstoken!]!
    AUTH_STEP_ONE: NexusGenRootTypes['STEP_ONE_RESPONSE']; // STEP_ONE_RESPONSE!
    AUTH_STEP_TWO: NexusGenRootTypes['STEP_TWO_RESPONSE']; // STEP_TWO_RESPONSE!
    channel: NexusGenRootTypes['channel']; // channel!
    channels: NexusGenRootTypes['channel'][]; // [channel!]!
    getAuthorizedCategories: NexusGenRootTypes['authorizedcategories']; // authorizedcategories!
    getAvisUser: NexusGenRootTypes['avis'][]; // [avis!]!
    getSendVerificationPiecesReferenceIdsAndStatus: string; // String!
    getUserInfo: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    getUserStats: NexusGenRootTypes['Stats']; // Stats!
    getVerificationPieces: NexusGenRootTypes['verificationpieces']; // verificationpieces!
    incompleteOfferings: NexusGenRootTypes['offering'][]; // [offering!]!
    isCandidateTo: NexusGenRootTypes['offering'][]; // [offering!]!
    messages: NexusGenRootTypes['message'][]; // [message!]!
    myIncompleteOffering: NexusGenRootTypes['offering'][]; // [offering!]!
    myIncompleteOfferingWithCandidates: NexusGenRootTypes['offering'][]; // [offering!]!
    offeringById: NexusGenRootTypes['offering']; // offering!
    offeringsUser: NexusGenRootTypes['offering'][]; // [offering!]!
    userById: NexusGenRootTypes['utilisateur'] | null; // utilisateur
    users: NexusGenRootTypes['utilisateur'][]; // [utilisateur!]!
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
    newChannel: NexusGenRootTypes['channel']; // channel!
    newMessage: NexusGenRootTypes['message']; // message!
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
  channel: { // field return type
    createdAt: any; // DateTime!
    id: string; // String!
    messages: NexusGenRootTypes['message'][]; // [message!]!
    users: NexusGenRootTypes['utilisateur'][]; // [utilisateur!]!
  }
  createChannel: { // field return type
    channel: NexusGenRootTypes['channel']; // channel!
    success: boolean; // Boolean!
  }
  message: { // field return type
    channel: NexusGenRootTypes['channel'] | null; // channel
    channelId: string | null; // String
    createdAt: any; // DateTime!
    id: string; // String!
    sentById: string | null; // String
    text: string; // String!
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
    channels: NexusGenRootTypes['channel'][]; // [channel!]!
    completedofferings: NexusGenRootTypes['offering'][]; // [offering!]!
    description: string | null; // String
    id: string; // String!
    messages: NexusGenRootTypes['message'][]; // [message!]!
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
    createChannel: { // args
      recipient: string; // String!
    }
    createMessage: { // args
      channelId?: string | null; // String
      recipient?: string | null; // String
      text: string; // String!
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
    channel: { // args
      id: string; // String!
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
    }
    offeringById: { // args
      id: string; // String!
    }
    offeringsUser: { // args
      numero: string; // String!
    }
    userById: { // args
      id: string; // String!
    }
  }
  Subscription: {
    newAvis: { // args
      userId: string; // String!
    }
    newChannel: { // args
      userId: string; // String!
    }
    newMessage: { // args
      channelIds: string[]; // [String!]!
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
  channel: {
    messages: { // args
      after?: NexusGenInputs['messageWhereUniqueInput'] | null; // messageWhereUniqueInput
      before?: NexusGenInputs['messageWhereUniqueInput'] | null; // messageWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    users: { // args
      after?: NexusGenInputs['utilisateurWhereUniqueInput'] | null; // utilisateurWhereUniqueInput
      before?: NexusGenInputs['utilisateurWhereUniqueInput'] | null; // utilisateurWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
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
    channels: { // args
      after?: NexusGenInputs['channelWhereUniqueInput'] | null; // channelWhereUniqueInput
      before?: NexusGenInputs['channelWhereUniqueInput'] | null; // channelWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    completedofferings: { // args
      after?: NexusGenInputs['offeringWhereUniqueInput'] | null; // offeringWhereUniqueInput
      before?: NexusGenInputs['offeringWhereUniqueInput'] | null; // offeringWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
    messages: { // args
      after?: NexusGenInputs['messageWhereUniqueInput'] | null; // messageWhereUniqueInput
      before?: NexusGenInputs['messageWhereUniqueInput'] | null; // messageWhereUniqueInput
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

export type NexusGenObjectNames = "AuthPayload" | "CandidateToOfferingSuccess" | "Mutation" | "Query" | "STEP_ONE_RESPONSE" | "STEP_TWO_RESPONSE" | "Stats" | "Subscription" | "authorizedcategories" | "avis" | "channel" | "createChannel" | "message" | "moyenne" | "notificationstoken" | "offering" | "tags" | "updateAppliedToType" | "updateSelectedEventDay" | "utilisateur" | "verificationpieces";

export type NexusGenInputNames = "ReferenceidUserIdIdCompoundUniqueInput" | "avisWhereUniqueInput" | "channelWhereUniqueInput" | "messageWhereUniqueInput" | "offeringWhereUniqueInput" | "uploadImageType" | "utilisateurWhereUniqueInput" | "verificationpiecesWhereUniqueInput";

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