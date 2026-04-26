import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import type { Memory } from "../memoryTypes";
import { memoryTypeOptions } from "../memoryTypes";
import type { MemoryPayload } from "../memoryService";

export function MemoryEditorModal({ memory, onClose, onSave }: { memory: Memory | null; onClose: () => void; onSave: (payload: Required<MemoryPayload>) => void }) {
  const [form, setForm] = useState<Required<MemoryPayload> | null>(null);

  useEffect(() => {
    if (memory) {
      setForm({
        memory_text: memory.memory_text,
        memory_type: memory.memory_type,
        emotion: memory.emotion,
        importance_score: memory.importance_score,
        is_active: memory.is_active,
      });
    }
  }, [memory]);

  if (!memory || !form) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (form) onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-purple-950/35 px-4 backdrop-blur-sm">
      <form className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl" onSubmit={submit}>
        <h2 className="text-2xl font-black text-purple-950">Edit memory</h2>
        <div className="mt-5 space-y-4">
          <Textarea label="Memory" value={form.memory_text} onChange={(e) => setForm({ ...form, memory_text: e.target.value })} />
          <Select label="Type" value={form.memory_type} onChange={(e) => setForm({ ...form, memory_type: e.target.value })} options={memoryTypeOptions.map((value) => ({ value, label: value.replace(/_/g, " ") }))} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Emotion</span>
            <input className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:ring-4 focus:ring-purple-100" value={form.emotion ?? ""} onChange={(e) => setForm({ ...form, emotion: e.target.value || null })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Importance: {form.importance_score}</span>
            <input className="w-full accent-purple-700" type="range" min={1} max={10} value={form.importance_score} onChange={(e) => setForm({ ...form, importance_score: Number(e.target.value) })} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button>Save memory</Button>
        </div>
      </form>
    </div>
  );
}
