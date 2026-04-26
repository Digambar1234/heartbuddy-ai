import { Card } from "../../../components/ui/Card";
import type { MoodSummary } from "../moodTypes";

export function MoodTrendSimple({ summary }: { summary: MoodSummary | null }) {
  const days = summary?.last_7_days ?? [];
  return (
    <Card>
      <h2 className="text-xl font-black text-purple-950">7-day trend</h2>
      {days.length === 0 ? (
        <p className="mt-4 text-slate-600">Add mood check-ins to see your trend.</p>
      ) : (
        <div className="mt-5 flex items-end gap-3">
          {days.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-2xl bg-gradient-to-t from-purple-700 to-rose-400" style={{ height: `${Math.max(24, day.average_intensity * 14)}px` }} />
              <span className="text-xs font-bold text-slate-500">{new Date(day.date).toLocaleDateString([], { weekday: "short" })}</span>
              <span className="text-xs text-purple-800">{day.dominant_mood}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
