import { FormEvent, useEffect, useState } from "react";
import { Brain, Download, Save, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { getApiError, settingsApi } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { CompanionGender, CompanionMode, CompanionTone, Profile } from "../types";
import { genderLabels, modeLabels, toneLabels } from "../utils/labels";

export default function SettingsPage() {
  const { user, profile, setProfile } = useAuthStore();
  const [form, setForm] = useState<Partial<Profile>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const current = profile ?? (await settingsApi.getProfile());
      setProfile(current);
      setForm(current);
    }
    void load();
  }, [profile, setProfile]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.companion_mode === "romantic_partner" && !user?.age_confirmed) {
      setError("Romantic Partner mode requires 18+ confirmation.");
      return;
    }
    setLoading(true);
    try {
      const updated = await settingsApi.updateProfile({
        companion_name: form.companion_name,
        companion_gender: form.companion_gender,
        companion_mode: form.companion_mode,
        companion_tone: form.companion_tone,
        user_support_preference: form.user_support_preference,
        emotional_boundaries: form.emotional_boundaries,
      });
      setProfile(updated);
      setSuccess("Settings saved.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-purple-950">Companion settings</h1>
        <p className="mt-3 text-slate-700">Tune how HeartBuddy shows up for you.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <form className="space-y-5" onSubmit={onSubmit}>
          <ErrorMessage message={error} />
          {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{success}</div>}
          <Input label="Companion name" value={form.companion_name ?? ""} onChange={(e) => setForm({ ...form, companion_name: e.target.value })} />
          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Companion gender"
              value={form.companion_gender ?? "neutral"}
              onChange={(e) => setForm({ ...form, companion_gender: e.target.value as CompanionGender })}
              options={(Object.keys(genderLabels) as CompanionGender[]).map((value) => ({ value, label: genderLabels[value] }))}
            />
            <Select
              label="Companion mode"
              value={form.companion_mode ?? "friend"}
              onChange={(e) => setForm({ ...form, companion_mode: e.target.value as CompanionMode })}
              options={(Object.keys(modeLabels) as CompanionMode[]).map((value) => ({ value, label: modeLabels[value] }))}
            />
          </div>
          {form.companion_mode === "romantic_partner" && !user?.age_confirmed && (
            <ErrorMessage message="Romantic Partner mode requires 18+ confirmation." />
          )}
          <Select
            label="Companion tone"
            value={form.companion_tone ?? "soft"}
            onChange={(e) => setForm({ ...form, companion_tone: e.target.value as CompanionTone })}
            options={(Object.keys(toneLabels) as CompanionTone[]).map((value) => ({ value, label: toneLabels[value] }))}
          />
          <Textarea label="Support preference" value={form.user_support_preference ?? ""} onChange={(e) => setForm({ ...form, user_support_preference: e.target.value })} />
          <Textarea label="Emotional boundaries" value={form.emotional_boundaries ?? ""} onChange={(e) => setForm({ ...form, emotional_boundaries: e.target.value })} />
          <Button disabled={loading} icon={!loading && <Save className="h-4 w-4" />}>{loading ? <LoadingSpinner /> : "Save settings"}</Button>
        </form>
      </Card>
      <div className="space-y-6">
        <Card>
          <h2 className="text-2xl font-black text-purple-950">Privacy shortcuts</h2>
          <p className="mt-2 text-slate-600">You control what HeartBuddy remembers and tracks.</p>
          <div className="mt-5 grid gap-3">
            <Link to="/memories"><Button className="w-full justify-start" variant="secondary" icon={<Brain className="h-4 w-4" />}>Manage memories</Button></Link>
            <Link to="/mood"><Button className="w-full justify-start" variant="secondary" icon={<TrendingUp className="h-4 w-4" />}>Manage mood logs</Button></Link>
            <Link to="/privacy"><Button className="w-full justify-start" variant="secondary" icon={<Download className="h-4 w-4" />}>Export data and privacy</Button></Link>
          </div>
        </Card>
        <Card className="border-amber-200 bg-amber-50/80">
          <h2 className="text-xl font-black text-amber-900">Safety note</h2>
          <p className="mt-2 font-semibold text-amber-900">HeartBuddy should support your real life, not replace it.</p>
        </Card>
      </div>
      </div>
    </AppLayout>
  );
}
