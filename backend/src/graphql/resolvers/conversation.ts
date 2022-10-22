import { GraphQLContext } from '@/utils/types';
import { Conversation, Prisma, User } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';

interface ConversationArgs {
  limit: number;
  offset: number;
}

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      args: ConversationArgs,
      context: GraphQLContext
    ): Promise<Conversation[]> => {
      const { limit, offset } = args;

      const { prisma, session } = context;

      try {
        const conversations = await prisma.conversation.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          take: limit,
          skip: offset,
          where: {
            participants: {
              every: {
                userId: {
                  contains: session?.user.id,
                },
              },
            },
          },
          include: conversationPopulated(session?.user.id as string),
        });

        return conversations;
      } catch (error) {
        throw new ApolloError('Something went wrong');
      }
    },

    conversation: async (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<Conversation | null> => {
      const { id } = args;

      const { prisma, session } = context;

      try {
        const conversation = await prisma.conversation.findUnique({
          where: {
            id,
          },
          include: conversationPopulated(session?.user.id as string),
        });

        return conversation;
      } catch (error) {
        throw new ApolloError('Something went wrong');
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { ids: string[]; name: string },
      context: GraphQLContext
    ): Promise<Conversation> => {
      const { ids, name } = args;

      const { prisma, session, pubsub } = context;

      const participantIds: string[] = [...ids, session?.user?.id as string];

      const participants = await prisma.user.findMany({
        where: {
          id: {
            in: participantIds,
          },
        },
      });

      const generateDefaultNameConversation = () => {
        const names = (participants as User[])
          .filter((participant) => participant.id !== session?.user.id)
          .map((participant) => participant.name);
        return names.join(', ');
      };

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === (session?.user?.id as string),
                })),
              },
            },
            name: !!name ? name : generateDefaultNameConversation(),
            isUnique: ids.length === 1,
          },
          include: conversationPopulated(session?.user.id as string),
        });

        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation,
        });

        return conversation;
      } catch (error) {
        throw new ApolloError('Something went wrong');
      }
    },
  },

  Subscription: {
    conversationCreated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;
        return pubsub.asyncIterator(['CONVERSATION_CREATED']);
      },
    },
  },
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    },
  });

export const conversationPopulated = (userId?: string) =>
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      where: {
        userId: {
          not: userId,
        },
      },
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    },
  });

export default resolvers;
