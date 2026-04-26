import { create } from "zustand";
import { getApiError } from "../../services/api";
import type { ChatMessage, ChatResponse, Conversation, Memory } from "./chatTypes";
import { chatService } from "./chatService";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  lastMemoriesUsed: Memory[];
  lastNewMemories: Memory[];
  lastRiskLevel: ChatResponse["risk_level"] | null;
  lastUsedFallback: boolean;
  loadConversations: () => Promise<void>;
  createConversation: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,
  lastMemoriesUsed: [],
  lastNewMemories: [],
  lastRiskLevel: null,
  lastUsedFallback: false,
  loadConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await chatService.getConversations();
      const activeConversationId = get().activeConversationId;
      const activeStillExists = conversations.some((conversation) => conversation.id === activeConversationId);
      set({
        conversations,
        isLoading: false,
        activeConversationId: activeStillExists ? activeConversationId : null,
        messages: activeStillExists ? get().messages : [],
        lastMemoriesUsed: activeStillExists ? get().lastMemoriesUsed : [],
        lastNewMemories: activeStillExists ? get().lastNewMemories : [],
        lastRiskLevel: activeStillExists ? get().lastRiskLevel : null,
        lastUsedFallback: activeStillExists ? get().lastUsedFallback : false,
      });
    } catch (err) {
      set({ error: getApiError(err), isLoading: false });
    }
  },
  createConversation: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await chatService.createConversation();
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
        messages: [],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: getApiError(err), isLoading: false });
    }
  },
  selectConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null, activeConversationId: conversationId });
    try {
      const detail = await chatService.getConversation(conversationId);
      set({ messages: detail.messages, isLoading: false });
    } catch (err) {
      set({ error: getApiError(err), isLoading: false });
    }
  },
  sendMessage: async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || get().isSending) return;
    set({ isSending: true, error: null, lastMemoriesUsed: [], lastNewMemories: [], lastRiskLevel: null });
    const tempId = `temp-${Date.now()}`;
    const conversationId = get().activeConversationId;
    const optimistic: ChatMessage = {
      id: tempId,
      conversation_id: conversationId ?? "pending",
      sender: "user",
      content: trimmed,
      emotion_detected: null,
      risk_level: "normal",
      memories_used_count: 0,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, optimistic] }));
    try {
      const response = await chatService.sendMessage(trimmed, conversationId);
      const userMessage: ChatMessage = {
        id: response.user_message_id,
        conversation_id: response.conversation_id,
        sender: "user",
        content: trimmed,
        emotion_detected: response.emotion_detected,
        risk_level: response.risk_level,
        memories_used_count: 0,
        created_at: new Date().toISOString(),
      };
      const assistantMessage: ChatMessage = {
        id: response.assistant_message_id,
        conversation_id: response.conversation_id,
        sender: "assistant",
        content: response.assistant_message,
        emotion_detected: response.emotion_detected,
        risk_level: response.risk_level,
        memories_used_count: response.memories_used.length,
        created_at: new Date().toISOString(),
      };
      const conversations = await chatService.getConversations();
      set((state) => ({
        activeConversationId: response.conversation_id,
        conversations,
        messages: [...state.messages.filter((item) => item.id !== tempId), userMessage, assistantMessage],
        isSending: false,
        lastMemoriesUsed: response.memories_used,
        lastNewMemories: response.new_memories_saved,
        lastRiskLevel: response.risk_level,
        lastUsedFallback: response.used_fallback_response,
      }));
    } catch (err) {
      set((state) => ({
        messages: state.messages.filter((item) => item.id !== tempId),
        error: getApiError(err),
        isSending: false,
      }));
    }
  },
  clearConversation: () => set({ activeConversationId: null, messages: [], lastMemoriesUsed: [], lastNewMemories: [] }),
  reset: () =>
    set({
      conversations: [],
      activeConversationId: null,
      messages: [],
      isLoading: false,
      isSending: false,
      error: null,
      lastMemoriesUsed: [],
      lastNewMemories: [],
      lastRiskLevel: null,
      lastUsedFallback: false,
    }),
}));
