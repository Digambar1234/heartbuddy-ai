import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { MoodLog } from "../moodTypes";
import { MoodIntensityBar } from "./MoodIntensityBar";

export function MoodHistoryList({ logs, onDelete }: { logs: MoodLog[]; onDelete: (id: string) => void }) {
  if (logs.length === 0) {
    return <Card><p className="text-slate-600">No mood check-ins yet. Your recent history will appear here.</p></Card>;
  }
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">{log.mood}</span>
                <span className="text-sm font-semibold text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-3 max-w-sm"><MoodIntensityBar value={log.intensity} /></div>
              {log.reason && <p className="mt-3 text-slate-700">{log.reason}</p>}
            </div>
            <Button variant="secondary" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(log.id)}>Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
