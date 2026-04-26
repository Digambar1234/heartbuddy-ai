import { Heart, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { ConversationSidebar } from "../features/chat/components/ConversationSidebar";
import { ChatBubble } from "../features/chat/components/ChatBubble";
import { ChatInput } from "../features/chat/components/ChatInput";
import { CrisisNotice } from "../features/chat/components/CrisisNotice";
import { MemoryUsedBanner } from "../features/chat/components/MemoryUsedBanner";
import { QuickPrompts } from "../features/chat/components/QuickPrompts";
import { TypingIndicator } from "../features/chat/components/TypingIndicator";
import { useChatStore } from "../features/chat/chatStore";
import { useAuthStore } from "../store/authStore";
import { modeLabels } from "../utils/labels";

export default function ChatPage() {
  const profile = useAuthStore((state) => state.profile);
  const endRef = useRef<HTMLDivElement | null>(null);
  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isSending,
    error,
    lastMemoriesUsed,
    lastNewMemories,
    lastRiskLevel,
    lastUsedFallback,
    loadConversations,
    createConversation,
    selectConversation,
    sendMessage,
  } = useChatStore();

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const companionName = profile?.companion_name ?? "HeartBuddy";

  return (
    <AppLayout fullWidth>
      <div className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[19rem_1fr]">
        <div className="hidden min-h-0 lg:block">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNew={() => void createConversation()}
            onSelect={(id) => void selectConversation(id)}
          />
        </div>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/45 shadow-xl shadow-purple-950/10 backdrop-blur">
          <header className="border-b border-white/70 bg-white/75 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-purple-700 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-purple-950">{companionName}</h1>
                  <p className="text-sm font-semibold text-slate-600">Here to support you</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-800">
                  {profile ? modeLabels[profile.companion_mode] : "Companion"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Not emergency care
                </span>
              </div>
            </div>
          </header>

          <div className="border-b border-white/60 bg-white/55 px-4 py-3 lg:hidden">
            <ConversationSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onNew={() => void createConversation()}
              onSelect={(id) => void selectConversation(id)}
            />
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            <ErrorMessage message={error} />
            <CrisisNotice show={lastRiskLevel === "crisis"} />
            {lastUsedFallback && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800">
                HeartBuddy is using the local fallback response because no LLM provider is connected.
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="grid h-full place-items-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-500 text-white shadow-glow">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-3xl font-black text-purple-950">Start a conversation.</h2>
                  <p className="mt-3 text-slate-600">HeartBuddy is ready to listen.</p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isSending && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          <footer className="space-y-3 border-t border-white/70 bg-white/65 p-4">
            <MemoryUsedBanner memories={lastMemoriesUsed} newMemories={lastNewMemories} />
            <QuickPrompts disabled={isSending} onPick={(prompt) => void sendMessage(prompt)} />
            <ChatInput disabled={isSending} onSend={(message) => void sendMessage(message)} />
          </footer>
        </section>
      </div>
    </AppLayout>
  );
}
