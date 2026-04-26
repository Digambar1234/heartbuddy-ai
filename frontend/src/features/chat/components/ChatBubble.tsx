import { motion } from "framer-motion";
import type { ChatMessage } from "../chatTypes";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[84%] rounded-3xl px-5 py-4 shadow-sm md:max-w-[72%] ${
          isUser
            ? "bg-purple-700 text-white"
            : "border border-white/80 bg-white/88 text-slate-800 shadow-purple-950/10"
        }`}
      >
        <p className="whitespace-pre-wrap leading-7">{message.content}</p>
        <div className={`mt-3 flex flex-wrap items-center gap-2 text-xs ${isUser ? "text-purple-100" : "text-slate-500"}`}>
          <span>{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {message.emotion_detected && message.emotion_detected !== "neutral" && (
            <span className={`rounded-full px-2 py-0.5 ${isUser ? "bg-white/15" : "bg-rose-50 text-rose-700"}`}>
              {message.emotion_detected}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
