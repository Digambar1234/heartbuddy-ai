import { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { MoodCheckInCard } from "../features/mood/components/MoodCheckInCard";
import { MoodHistoryList } from "../features/mood/components/MoodHistoryList";
import { MoodSummaryCards } from "../features/mood/components/MoodSummaryCards";
import { MoodTrendSimple } from "../features/mood/components/MoodTrendSimple";
import { moodService } from "../features/mood/moodService";
import type { MoodLog, MoodSummary, MoodValue } from "../features/mood/moodTypes";
import { getApiError } from "../services/api";

export default function MoodPage() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [summary, setSummary] = useState<MoodSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setError("");
    try {
      const [nextLogs, nextSummary] = await Promise.all([moodService.list(), moodService.summary()]);
      setLogs(nextLogs);
      setSummary(nextSummary);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(payload: { mood: MoodValue; intensity: number; reason?: string }) {
    setLoading(true);
    try {
      await moodService.create(payload);
      await load();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    await moodService.remove(id);
    await load();
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-purple-950">Your Mood Journey</h1>
        <p className="mt-3 text-slate-700">Track how you feel and notice emotional patterns over time.</p>
      </div>
      <ErrorMessage message={error} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <MoodCheckInCard loading={loading} onSubmit={(payload) => void create(payload)} />
        <MoodTrendSimple summary={summary} />
      </div>
      <div className="mt-6"><MoodSummaryCards summary={summary} /></div>
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-black text-purple-950">Recent mood history</h2>
        <MoodHistoryList logs={logs} onDelete={(id) => void remove(id)} />
      </div>
    </AppLayout>
  );
}
