import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export function PrivacyDangerZone({ onDeleteMemories, onDeleteMoodLogs }: { onDeleteMemories: () => void; onDeleteMoodLogs: () => void }) {
  return (
    <Card className="border-rose-200">
      <h2 className="text-2xl font-black text-rose-700">Danger zone</h2>
      <p className="mt-2 text-slate-600">These actions permanently delete personal data from HeartBuddy AI.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="danger" onClick={onDeleteMemories}>Delete all memories</Button>
        <Button variant="danger" onClick={onDeleteMoodLogs}>Delete all mood logs</Button>
      </div>
    </Card>
  );
}
