import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';
import { processUpload } from '../utils';
import { ReactNativeFile } from 'apollo-upload-client';

const prisma = new PrismaClient();
const pubsub = new PubSub();

export interface CustomRequest extends Request {
  get: (a: string) => string;
}

export type ProcessUpload = (upload: ReactNativeFile) => Promise<string>;
export interface Context {
  request: CustomRequest;
  prisma: PrismaClient;
  pubsub: PubSub;
  processUpload: ProcessUpload;
}

export const createContext = ({
  request
}: {
  request: CustomRequest;
}): Context => {
  return { request, prisma, pubsub, processUpload };
};
