import { gql } from 'apollo-server-core';

const typeDefs = gql`
  scalar Date

  type Participant {
    id: String
    user: User
    userId: String
    hasSeenLatestMessage: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type Conversation {
    id: String
    # latestMessage: Message
    participants: [Participant]
    name: String
    isUnique: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    conversations(limit: Int, offset: Int): [Conversation]
    conversation(id: String): Conversation
  }

  type Mutation {
    createConversation(ids: [String], name: String): Conversation
  }

  type Subscription {
    conversationCreated: Conversation
  }
`;

export default typeDefs;
