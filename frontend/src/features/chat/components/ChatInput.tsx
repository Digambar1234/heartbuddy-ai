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
    <div className="rounded-2xl border border-white/80 bg-white/85 p-2 shadow-xl shadow-purple-950/10 backdrop-blur lg:rounded-3xl lg:p-3">
      <div className="flex items-end gap-2 lg:gap-3">
        <textarea
          className="max-h-28 min-h-12 flex-1 resize-none rounded-2xl border border-purple-100 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 lg:max-h-36 lg:min-h-14 lg:px-4 lg:text-base"
          placeholder="Tell HeartBuddy what you are feeling..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <Button className="h-12 w-12 shrink-0 rounded-2xl px-0 lg:h-14 lg:w-14" disabled={disabled || !value.trim()} onClick={submit} type="button">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
