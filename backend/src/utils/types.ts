import { PrismaClient, User } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws';
import { ISODateString } from 'next-auth';

export interface Session {
  user: User;
  expires: ISODateString;
}

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface SearchUsersResponse {
  success?: boolean;
  error?: string;
  users?: User[];
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}
