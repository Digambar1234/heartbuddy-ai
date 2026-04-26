import { FormEvent, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { memoryTypeOptions } from "../memoryTypes";
import type { MemoryPayload } from "../memoryService";

export function AddMemoryForm({ loading, onAdd }: { loading?: boolean; onAdd: (payload: MemoryPayload) => void }) {
  const [memoryText, setMemoryText] = useState("");
  const [memoryType, setMemoryType] = useState("personal_fact");
  const [emotion, setEmotion] = useState("");
  const [importance, setImportance] = useState(7);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!memoryText.trim()) return;
    onAdd({ memory_text: memoryText, memory_type: memoryType, emotion: emotion || null, importance_score: importance });
    setMemoryText("");
    setEmotion("");
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Textarea label="Add a memory manually" value={memoryText} onChange={(e) => setMemoryText(e.target.value)} placeholder="I feel demotivated when people compare me with others." />
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="Type" value={memoryType} onChange={(e) => setMemoryType(e.target.value)} options={memoryTypeOptions.map((value) => ({ value, label: value.replace(/_/g, " ") }))} />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Emotion</span>
          <input className="w-full rounded-2xl border border-purple-100 bg-white/90 px-4 py-3 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100" value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="demotivated" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Importance: {importance}</span>
          <input className="w-full accent-purple-700" type="range" min={1} max={10} value={importance} onChange={(e) => setImportance(Number(e.target.value))} />
        </label>
      </div>
      <Button disabled={loading}>Add memory</Button>
    </form>
  );
}
