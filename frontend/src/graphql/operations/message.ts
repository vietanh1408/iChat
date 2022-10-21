import { gql } from "@apollo/client";

const MessageFields = `
    id
    message
    senderId
    sender {
    id
    name
    image
    }
    conversationId
    conversation {
    id
    name
    }
    createdAt
    updatedAt
`;

export default {
  Queries: {
    messages: gql`
      query messages($conversationId: String) {
        messages(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },

  Mutations: {
    createMessage: gql`
      mutation createMessage($conversationId: String, $message: String) {
        createMessage(conversationId: $conversationId, message: $message) {
          ${MessageFields}
        }
      }
    `,
  },

  Subscriptions: {
    messageCreated: gql`
      subscription MessageCreated {
        messageCreated {
          ${MessageFields}
        }
      }
    `,
  },
};
