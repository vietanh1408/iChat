import { Prisma } from "@prisma/client";
import { participantPopulated } from "./../../../backend/src/graphql/resolvers/conversation";
import { Message } from "./message";
import { User } from "./user";

export interface CreateConversationInput {
  ids: string[];
  name?: string;
}

export interface Conversation {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Participant {
  id: string;
  userId: string;
  user: User;
  hasSeenLatestMessage: boolean;
}

export interface ConversationsArgs {
  limit?: number;
  offset?: number;
}

export interface ConversationsData {
  conversations: Conversation[];
}

export interface ConversationData {
  conversation: Conversation;
}

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
