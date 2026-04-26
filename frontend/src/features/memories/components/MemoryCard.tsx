import { Edit3, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { Memory } from "../memoryTypes";

export function MemoryCard({
  memory,
  onEdit,
  onToggle,
  onDelete,
}: {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onToggle: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
}) {
  return (
    <Card className={!memory.is_active ? "opacity-70" : ""}>
      <div className="flex items-start justify-between gap-3">
        <p className="leading-7 text-slate-800">{memory.memory_text}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${memory.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {memory.is_active ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800">{memory.memory_type.replace(/_/g, " ")}</span>
        {memory.emotion && <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">{memory.emotion}</span>}
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">Importance {memory.importance_score}/10</span>
      </div>
      <div className="mt-4 text-xs text-slate-500">
        Created {new Date(memory.created_at).toLocaleDateString()}
        {memory.last_used_at && <> · Last used {new Date(memory.last_used_at).toLocaleDateString()}</>}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="secondary" icon={<Edit3 className="h-4 w-4" />} onClick={() => onEdit(memory)}>Edit</Button>
        <Button variant="secondary" icon={memory.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} onClick={() => onToggle(memory)}>
          {memory.is_active ? "Deactivate" : "Activate"}
        </Button>
        <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(memory)}>Delete</Button>
      </div>
    </Card>
  );
}
