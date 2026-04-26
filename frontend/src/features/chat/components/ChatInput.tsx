import { Send } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { Button } from "../../../components/ui/Button";

export function ChatInput({ disabled, onSend }: { disabled?: boolean; onSend: (message: string) => void }) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="rounded-3xl border border-white/80 bg-white/85 p-3 shadow-xl shadow-purple-950/10 backdrop-blur">
      <div className="flex items-end gap-3">
        <textarea
          className="max-h-36 min-h-14 flex-1 resize-none rounded-2xl border border-purple-100 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          placeholder="Tell HeartBuddy what you are feeling..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <Button className="h-14 w-14 rounded-2xl px-0" disabled={disabled || !value.trim()} onClick={submit} type="button">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
