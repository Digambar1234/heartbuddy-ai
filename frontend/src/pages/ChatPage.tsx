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
      <div className="grid h-[calc(100dvh-7rem)] gap-4 lg:h-[calc(100vh-8rem)] lg:grid-cols-[19rem_1fr]">
        <div className="hidden min-h-0 lg:block">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNew={() => void createConversation()}
            onSelect={(id) => void selectConversation(id)}
          />
        </div>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/48 shadow-xl shadow-purple-950/10 backdrop-blur lg:rounded-3xl">
          <header className="hero-sheen border-b border-white/70 px-4 py-3 lg:px-5 lg:py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-purple-700 p-0.5 shadow-glow">
                  <img src="/assets/heartbuddy-3d-companion.png" alt="HeartBuddy avatar" className="h-11 w-11 rounded-[0.9rem] object-cover lg:h-12 lg:w-12" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-purple-950 lg:text-xl">{companionName}</h1>
                  <p className="text-xs font-semibold text-slate-600 lg:text-sm">Here to support you</p>
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
              compact
            />
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 md:px-6">
            <ErrorMessage message={error} />
            <CrisisNotice show={lastRiskLevel === "crisis"} />
            {lastUsedFallback && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800">
                HeartBuddy is using the local fallback response because no LLM provider is connected.
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="grid h-full min-h-72 place-items-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-rose-500 text-white shadow-glow lg:h-16 lg:w-16">
                    <Heart className="h-7 w-7 lg:h-8 lg:w-8" />
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-purple-950 lg:mt-5 lg:text-3xl">Start a conversation.</h2>
                  <p className="mt-2 text-sm text-slate-600 lg:mt-3 lg:text-base">HeartBuddy is ready to listen.</p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isSending && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          <footer className="space-y-2 border-t border-white/70 bg-white/75 p-3 lg:space-y-3 lg:p-4">
            <MemoryUsedBanner memories={lastMemoriesUsed} newMemories={lastNewMemories} />
            <QuickPrompts disabled={isSending} onPick={(prompt) => void sendMessage(prompt)} />
            <ChatInput disabled={isSending} onSend={(message) => void sendMessage(message)} />
          </footer>
        </section>
      </div>
    </AppLayout>
  );
}
