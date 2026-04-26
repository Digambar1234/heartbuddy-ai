import { api } from "../../services/api";
import type { ChatResponse, Conversation, ConversationDetail } from "./chatTypes";

export const chatService = {
  createConversation: (title?: string) =>
    api.post<Conversation>("/chat/conversations", { title }).then((res) => res.data),
  getConversations: () => api.get<Conversation[]>("/chat/conversations").then((res) => res.data),
  getConversation: (conversationId: string) =>
    api.get<ConversationDetail>(`/chat/conversations/${conversationId}`).then((res) => res.data),
  sendMessage: (message: string, conversationId?: string | null) =>
    api.post<ChatResponse>("/chat/message", { message, conversation_id: conversationId }).then((res) => res.data),
};
