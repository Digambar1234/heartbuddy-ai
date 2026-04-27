import { Brain, Heart, MessageCircle, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { chatService } from "../features/chat/chatService";
import type { Conversation } from "../features/chat/chatTypes";
import { MoodCheckInCard } from "../features/mood/components/MoodCheckInCard";
import { moodService } from "../features/mood/moodService";
import type { MoodSummary, MoodValue } from "../features/mood/moodTypes";
import { memoryService } from "../features/memories/memoryService";
import type { Memory } from "../features/memories/memoryTypes";
import { getApiError } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { modeLabels, toneLabels } from "../utils/labels";

export default function DashboardPage() {
  const { user, profile } = useAuthStore();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [moodSummary, setMoodSummary] = useState<MoodSummary | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    const [memoryResult, moodResult, conversationResult] = await Promise.allSettled([
      memoryService.list({ active_only: true }),
      moodService.summary(),
      chatService.getConversations(),
    ]);

    if (memoryResult.status === "fulfilled") setMemories(memoryResult.value);
    if (moodResult.status === "fulfilled") setMoodSummary(moodResult.value);
    if (conversationResult.status === "fulfilled") setConversations(conversationResult.value.slice(0, 3));

    const firstFailure = [memoryResult, moodResult, conversationResult].find((result) => result.status === "rejected");
    if (firstFailure?.status === "rejected") setError(getApiError(firstFailure.reason));
    setIsLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function quickMood(payload: { mood: MoodValue; intensity: number; reason?: string }) {
    try {
      setError(null);
      await moodService.create(payload);
      await load();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  const latestMemory = memories[0];

  return (
    <AppLayout>
      <div className="mb-8">
        <Badge>Final MVP</Badge>
        <h1 className="mt-4 text-4xl font-black text-purple-950">Good to see you, {user?.name}.</h1>
        <p className="mt-3 max-w-2xl text-slate-700">Your companion, memories, moods, and conversations are all in one place.</p>
      </div>
      <ErrorMessage message={error} />
      {isLoading && (
        <div className="mb-6 mt-4 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm font-semibold text-purple-900 shadow-sm">
          Refreshing your HeartBuddy dashboard...
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-[1fr_220px]">
          <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-purple-700 text-white"><Heart className="h-7 w-7" /></div>
            <div>
              <p className="text-sm font-bold text-rose-600">Your companion</p>
              <h2 className="text-2xl font-black text-purple-950">{profile?.companion_name ?? "HeartBuddy"}</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Info label="Mode" value={profile ? modeLabels[profile.companion_mode] : "Not set"} />
            <Info label="Tone" value={profile ? toneLabels[profile.companion_tone] : "Not set"} />
          </div>
          <Link to="/chat" className="mt-6 inline-flex"><Button icon={<MessageCircle className="h-4 w-4" />}>Talk to HeartBuddy</Button></Link>
          </div>
          <div className="hidden bg-gradient-to-br from-rose-100 to-indigo-100 p-3 md:block">
            <img src="/assets/heartbuddy-3d-companion.png" alt="HeartBuddy companion visual" className="h-full min-h-64 w-full rounded-2xl object-cover" />
          </div>
          </div>
        </Card>

        <MoodCheckInCard loading={isLoading} onSubmit={(payload) => void quickMood(payload)} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Card>
          <Brain className="h-8 w-8 text-purple-600" />
          <h3 className="mt-4 text-xl font-black text-purple-950">Memory summary</h3>
          <p className="mt-2 text-3xl font-black text-purple-950">{memories.length}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{latestMemory?.memory_text ?? "No active memories yet."}</p>
          <Link to="/memories" className="mt-5 inline-flex"><Button variant="secondary">View memories</Button></Link>
        </Card>
        <Card>
          <TrendingUp className="h-8 w-8 text-rose-500" />
          <h3 className="mt-4 text-xl font-black text-purple-950">Mood summary</h3>
          <p className="mt-2 text-slate-700">Latest: {moodSummary?.recent_mood ?? "No check-ins yet"}</p>
          <p className="mt-1 text-slate-700">Average intensity: {moodSummary?.average_intensity ?? "Not enough data"}</p>
          <Link to="/mood" className="mt-5 inline-flex"><Button variant="secondary">Open mood journey</Button></Link>
        </Card>
        <Card>
          <MessageCircle className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 text-xl font-black text-purple-950">Recent conversations</h3>
          <div className="mt-3 space-y-2">
            {conversations.length === 0 ? <p className="text-sm text-slate-600">No conversations yet.</p> : conversations.map((item) => (
              <p key={item.id} className="truncate rounded-2xl bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-900">{item.title ?? "New conversation"}</p>
            ))}
          </div>
          <Link to="/chat" className="mt-5 inline-flex"><Button variant="secondary">Continue chat</Button></Link>
        </Card>
      </div>

      <Card className="mt-6 border-amber-200 bg-amber-50/80">
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
          <p className="font-semibold text-amber-900">HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.</p>
        </div>
      </Card>
    </AppLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-purple-50 px-4 py-3">
      <span className="block text-sm font-bold text-slate-600">{label}</span>
      <span className="mt-1 block text-sm font-black text-purple-950">{value}</span>
    </div>
  );
}
