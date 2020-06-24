import { PrismaClient } from '@prisma/client';

import { PubSub } from 'graphql-yoga';
import { processUpload } from '../utils';

const prisma = new PrismaClient();
const pubsub = new PubSub();

export interface Context {
  request: Request;
  prisma: PrismaClient;
  pubsub: PubSub;
  processUpload: (a: any) => Promise<string>;
}

export const createContext = ({ request }: { request: Request }): Context => {
  return { request, prisma, pubsub, processUpload };
};
