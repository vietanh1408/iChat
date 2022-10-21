import { gql } from "@apollo/client";

const ConversationFields = `
  id
  name
  participants {
    id
    hasSeenLatestMessage
    userId
    user {
      id
      email
      image
      name
      emailVerified
    }
  }
`;

export default {
  Queries: {
    conversations: gql`
      query Conversations($limit: Int, $offset: Int) {
        conversations(limit: $limit, offset: $offset) {
          ${ConversationFields}
        }
      }
    `,

    conversation: gql`
      query Conversation($id: String) {
        conversation(id: $id) {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($ids: [String], $name: String) {
        createConversation(ids: $ids, name: $name) {
          ${ConversationFields}
        }
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `,
  },
};
