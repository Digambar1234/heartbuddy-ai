import { MessageCirclePlus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Conversation } from "../chatTypes";

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onNew,
  onSelect,
}: {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNew: () => void;
  onSelect: (conversationId: string) => void;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col rounded-3xl border border-white/70 bg-white/70 p-4 shadow-xl shadow-purple-950/10 backdrop-blur">
      <Button icon={<MessageCirclePlus className="h-4 w-4" />} onClick={onNew} type="button">
        New conversation
      </Button>
      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full rounded-2xl px-4 py-3 text-left transition ${
              activeConversationId === conversation.id ? "bg-purple-700 text-white" : "bg-white/75 text-slate-700 hover:bg-purple-50"
            }`}
          >
            <p className="truncate text-sm font-black">{conversation.title ?? "New conversation"}</p>
            <p className={`mt-1 text-xs ${activeConversationId === conversation.id ? "text-purple-100" : "text-slate-500"}`}>
              {new Date(conversation.updated_at).toLocaleDateString()}
            </p>
          </button>
        ))}
        {conversations.length === 0 && <p className="px-2 py-6 text-sm font-medium text-slate-500">No conversations yet.</p>}
      </div>
    </aside>
  );
}
