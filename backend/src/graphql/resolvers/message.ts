import { GraphQLContext } from '@/utils/types';
import { Message, Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';

interface CreateMessageInput {
  conversationId: string;
  message: string;
}

const resolvers = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Message[]> => {
      const { conversationId } = args;

      const { prisma } = context;

      try {
        const messages = await prisma.message.findMany({
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            conversationId,
          },
          include: messagePopulated,
        });

        return messages;
      } catch (error) {
        throw new ApolloError('Something went wrong');
      }
    },
  },
  Mutation: {
    createMessage: async (
      _: any,
      args: CreateMessageInput,
      context: GraphQLContext
    ): Promise<Message> => {
      const { conversationId, message } = args;

      const { prisma, session, pubsub } = context;

      try {
        const newMessage = await prisma.message.create({
          data: {
            senderId: session?.user.id as string,
            conversationId,
            message,
          },
          include: messagePopulated,
        });

        // emit event create new message
        pubsub.publish('MESSAGE_CREATED', {
          messageCreated: newMessage,
        });

        return newMessage;
      } catch (error) {
        throw new ApolloError('Something went wrong');
      }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;
        return pubsub.asyncIterator(['MESSAGE_CREATED']);
      },
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  conversation: {
    select: {
      id: true,
      name: true,
    },
  },
});

export default resolvers;
