import { Card } from "../../../components/ui/Card";
import type { MoodSummary } from "../moodTypes";

export function MoodSummaryCards({ summary }: { summary: MoodSummary | null }) {
  const cards = [
    ["Total check-ins", summary?.total_logs ?? 0],
    ["Most common mood", summary?.most_common_mood ?? "Not enough data"],
    ["Average intensity", summary?.average_intensity ?? "Not enough data"],
    ["Latest mood", summary?.recent_mood ? `${summary.recent_mood} (${summary.recent_intensity}/10)` : "Not enough data"],
  ];
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <Card key={label.toString()}>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-purple-950">{value}</p>
        </Card>
      ))}
    </div>
  );
}
