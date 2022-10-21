import { gql } from 'apollo-server-core';

const typeDefs = gql`
  scalar Date

  type Message {
    id: String
    message: String
    conversationId: String
    conversation: Conversation
    senderId: String
    sender: User
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    messages(conversationId: String): [Message]
  }

  type Mutation {
    createMessage(conversationId: String, message: String): Message
  }

  type Subscription {
    messageCreated: Message
  }
`;

export default typeDefs;
