import { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { ExportDataButton } from "../features/privacy/components/ExportDataButton";
import { PrivacyDangerZone } from "../features/privacy/components/PrivacyDangerZone";
import { privacyService } from "../features/privacy/privacyService";
import { getApiError } from "../services/api";

export default function PrivacyPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function runDanger(action: "memories" | "mood") {
    const label = action === "memories" ? "all memories" : "all mood logs";
    if (!window.confirm(`Permanently delete ${label}?`)) return;
    try {
      const result = action === "memories" ? await privacyService.deleteMemories() : await privacyService.deleteMoodLogs();
      setSuccess(`Deleted ${result.deleted_count} records.`);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-purple-950">Privacy & Control</h1>
        <p className="mt-3 text-slate-700">Export or remove personal data HeartBuddy uses to support you.</p>
      </div>
      <ErrorMessage message={error} />
      {success && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{success}</div>}
      <div className="grid gap-6">
        <Card>
          <h2 className="text-2xl font-black text-purple-950">Export your data</h2>
          <p className="mt-2 text-slate-600">Download profile, companion settings, memories, mood logs, goals, and conversation metadata. Password hashes are never exported.</p>
          <div className="mt-5"><ExportDataButton /></div>
        </Card>
        <PrivacyDangerZone onDeleteMemories={() => void runDanger("memories")} onDeleteMoodLogs={() => void runDanger("mood")} />
        <Card>
          <h2 className="text-2xl font-black text-purple-950">Safety and disclaimer</h2>
          <p className="mt-2 text-slate-700">HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.</p>
          <p className="mt-3 text-slate-600">Account deletion can be added in a future version.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
