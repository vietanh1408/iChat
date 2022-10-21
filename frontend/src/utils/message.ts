import { Conversation } from "./conversation";
import { User } from "./user";

export interface Message {
  id: string;
  message: string;
  senderId: string;
  sender: User;
  conversationId: string;
  conversation: Conversation;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessagesData {
  messages: Message[];
}
