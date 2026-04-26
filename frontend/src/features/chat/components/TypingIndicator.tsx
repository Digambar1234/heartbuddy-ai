export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-3xl border border-white/80 bg-white/85 px-5 py-4 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-rose-500 [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:240ms]" />
      </div>
    </div>
  );
}
