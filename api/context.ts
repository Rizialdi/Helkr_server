import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';
import {
  processUpload,
  sendPushNotification,
  stringOrObject,
  authentication_step_one,
  authentication_step_two
} from '../utils';
import { ReactNativeFile } from 'apollo-upload-client';

const prisma = new PrismaClient();
const pubsub = new PubSub();

export interface CustomRequest extends Request {
  get: (a: string) => string;
}

export type AuthenticationApi = {
  step_one: (
    numero: string
  ) => Promise<{
    id: string;
    status: string;
  }>;
  step_two: (
    id: string,
    token: string
  ) => Promise<{
    success: boolean;
  }>;
};

export type ProcessUpload = (upload: ReactNativeFile) => Promise<string>;
export type SendPushNotification = (
  expoPushToken: string,
  payload: stringOrObject[]
) => void;
export interface Context {
  request: CustomRequest;
  prisma: PrismaClient;
  pubsub: PubSub;
  processUpload: ProcessUpload;
  sendPushNotification: SendPushNotification;
  authenticationApi: AuthenticationApi;
}

export const createContext = ({
  request
}: {
  request: CustomRequest;
}): Context => {
  return {
    request,
    prisma,
    pubsub,
    processUpload,
    sendPushNotification,
    authenticationApi: {
      step_one: authentication_step_one,
      step_two: authentication_step_two
    }
  };
};
