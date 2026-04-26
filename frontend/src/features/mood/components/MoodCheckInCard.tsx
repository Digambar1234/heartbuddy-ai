import { FormEvent, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { moodOptions, type MoodValue } from "../moodTypes";

export function MoodCheckInCard({ loading, onSubmit }: { loading?: boolean; onSubmit: (payload: { mood: MoodValue; intensity: number; reason?: string }) => void }) {
  const [mood, setMood] = useState<MoodValue>("neutral");
  const [intensity, setIntensity] = useState(5);
  const [reason, setReason] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ mood, intensity, reason: reason || undefined });
    setReason("");
  }

  return (
    <Card>
      <h2 className="text-2xl font-black text-purple-950">How are you feeling right now?</h2>
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <Select label="Mood" value={mood} onChange={(e) => setMood(e.target.value as MoodValue)} options={moodOptions.map((value) => ({ value, label: value }))} />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">How strong is this feeling? {intensity}/10</span>
          <input className="w-full accent-purple-700" type="range" min={1} max={10} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} />
        </label>
        <Textarea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What caused this feeling? Optional." />
        <Button disabled={loading}>Save mood</Button>
      </form>
    </Card>
  );
}
