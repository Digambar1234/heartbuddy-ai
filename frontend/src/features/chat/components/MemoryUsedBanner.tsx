import type { Memory } from "../chatTypes";

export function MemoryUsedBanner({ memories, newMemories }: { memories: Memory[]; newMemories: Memory[] }) {
  if (memories.length === 0 && newMemories.length === 0) return null;
  return (
    <div className="space-y-2">
      {memories.length > 0 && (
        <div className="rounded-2xl border border-purple-100 bg-purple-50/90 px-4 py-3 text-sm font-semibold text-purple-800">
          HeartBuddy used {memories.length} {memories.length === 1 ? "memory" : "memories"} to personalize this response.
        </div>
      )}
      {newMemories.length > 0 && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/90 px-4 py-3 text-sm font-semibold text-rose-800">
          HeartBuddy remembered something important.
        </div>
      )}
    </div>
  );
}
