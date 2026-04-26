const prompts = [
  "I feel lonely today",
  "Motivate me softly",
  "I had a bad day",
  "I miss someone",
  "I feel like giving up",
  "Remind me why I started",
];

export function QuickPrompts({ disabled, onPick }: { disabled?: boolean; onPick: (prompt: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onPick(prompt)}
          className="shrink-0 rounded-full border border-purple-100 bg-white/80 px-4 py-2 text-sm font-semibold text-purple-900 transition hover:bg-purple-50 disabled:opacity-60"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
