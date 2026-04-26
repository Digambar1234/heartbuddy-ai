import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "../components/common/OnboardingStepCard";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { getApiError, onboardingApi } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { CompanionGender, CompanionMode, CompanionTone, OnboardingPayload } from "../types";
import { genderLabels, modeLabels, toneLabels } from "../utils/labels";

const supportOptions = [
  "Listen first",
  "Motivate me",
  "Help me think clearly",
  "Distract me with positive conversation",
  "Give me a small action plan",
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<OnboardingPayload>({
    gender: "prefer_not_to_say",
    age_confirmed: false,
    companion_name: "HeartBuddy",
    companion_gender: "neutral",
    companion_mode: "friend",
    companion_tone: "soft",
    user_support_preference: "Listen first",
    emotional_boundaries: "",
    initial_goal_text: "",
    initial_memory_text: "",
  });

  const steps = useMemo(
    () => [
      "Welcome",
      "About you",
      "Companion",
      "Mode",
      "Tone",
      "Support",
      "Goal",
      "Memory",
    ],
    [],
  );

  function next() {
    setError("");
    if (step === 3 && form.companion_mode === "romantic_partner" && !form.age_confirmed) {
      setError("Romantic Partner mode is only available for users who confirm they are 18 or older.");
      return;
    }
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (form.companion_mode === "romantic_partner" && !form.age_confirmed) {
      setError("Romantic Partner mode is only available for users who confirm they are 18 or older.");
      return;
    }
    setLoading(true);
    try {
      const response = await onboardingApi.complete(form);
      setUser(response.user);
      setProfile(response.profile);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="premium-bg min-h-screen px-4 py-10">
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="mb-4 flex items-center justify-between text-sm font-bold text-purple-900">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{steps[step]}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/80">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-purple-600 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={submit}>
        {step === 0 && (
          <OnboardingStepCard title="Welcome to HeartBuddy AI." subtitle="Let’s create a companion who understands you.">
            <p className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-800">
              HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.
            </p>
          </OnboardingStepCard>
        )}
        {step === 1 && (
          <OnboardingStepCard title="Tell us a little about you">
            <Select
              label="Gender"
              value={form.gender ?? ""}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
                { value: "prefer_not_to_say", label: "Prefer not to say" },
              ]}
            />
            <label className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 font-semibold text-slate-700">
              <input
                className="mt-1 h-5 w-5 accent-purple-700"
                type="checkbox"
                checked={form.age_confirmed}
                onChange={(e) => setForm({ ...form, age_confirmed: e.target.checked })}
              />
              I confirm I am 18 or older
            </label>
          </OnboardingStepCard>
        )}
        {step === 2 && (
          <OnboardingStepCard title="Choose your companion">
            <Input label="Companion name" value={form.companion_name} onChange={(e) => setForm({ ...form, companion_name: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(genderLabels) as CompanionGender[]).map((gender) => (
                <button type="button" key={gender} onClick={() => setForm({ ...form, companion_gender: gender })} className={`rounded-2xl border p-4 text-left font-bold transition ${form.companion_gender === gender ? "border-purple-500 bg-purple-50 text-purple-900" : "border-purple-100 bg-white text-slate-700"}`}>
                  {genderLabels[gender]}
                </button>
              ))}
            </div>
          </OnboardingStepCard>
        )}
        {step === 3 && (
          <OnboardingStepCard title="Choose companion mode">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(modeLabels) as CompanionMode[]).map((mode) => (
                <button type="button" key={mode} onClick={() => setForm({ ...form, companion_mode: mode })} className={`rounded-2xl border p-4 text-left font-bold transition ${form.companion_mode === mode ? "border-purple-500 bg-purple-50 text-purple-900" : "border-purple-100 bg-white text-slate-700"}`}>
                  {modeLabels[mode]}
                </button>
              ))}
            </div>
            {form.companion_mode === "romantic_partner" && !form.age_confirmed && (
              <ErrorMessage message="Romantic Partner mode is only available for users who confirm they are 18 or older." />
            )}
          </OnboardingStepCard>
        )}
        {step === 4 && (
          <OnboardingStepCard title="Choose tone">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(toneLabels) as CompanionTone[]).map((tone) => (
                <button type="button" key={tone} onClick={() => setForm({ ...form, companion_tone: tone })} className={`rounded-2xl border p-4 text-left font-bold transition ${form.companion_tone === tone ? "border-purple-500 bg-purple-50 text-purple-900" : "border-purple-100 bg-white text-slate-700"}`}>
                  {toneLabels[tone]}
                </button>
              ))}
            </div>
          </OnboardingStepCard>
        )}
        {step === 5 && (
          <OnboardingStepCard title="When you feel low, how should HeartBuddy support you?">
            <div className="grid gap-3">
              {supportOptions.map((option) => (
                <button type="button" key={option} onClick={() => setForm({ ...form, user_support_preference: option })} className={`rounded-2xl border p-4 text-left font-bold transition ${form.user_support_preference === option ? "border-purple-500 bg-purple-50 text-purple-900" : "border-purple-100 bg-white text-slate-700"}`}>
                  {option}
                </button>
              ))}
            </div>
          </OnboardingStepCard>
        )}
        {step === 6 && (
          <OnboardingStepCard title="What are you trying to improve in your life?">
            <Textarea label="Initial goal" value={form.initial_goal_text ?? ""} onChange={(e) => setForm({ ...form, initial_goal_text: e.target.value })} />
          </OnboardingStepCard>
        )}
        {step === 7 && (
          <OnboardingStepCard title="Is there anything important HeartBuddy should remember about you?">
            <Textarea label="Initial memory" placeholder="I feel demotivated when I compare myself with others." value={form.initial_memory_text ?? ""} onChange={(e) => setForm({ ...form, initial_memory_text: e.target.value })} />
            <Textarea label="Emotional boundaries" placeholder="Topics, tones, or reminders you want HeartBuddy to avoid." value={form.emotional_boundaries ?? ""} onChange={(e) => setForm({ ...form, emotional_boundaries: e.target.value })} />
          </OnboardingStepCard>
        )}

        <div className="mx-auto mt-6 flex max-w-2xl items-center justify-between gap-3">
          <Button type="button" variant="secondary" disabled={step === 0 || loading} onClick={() => setStep((value) => Math.max(value - 1, 0))} icon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
          <div className="flex-1"><ErrorMessage message={error} /></div>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next} icon={<ArrowRight className="h-4 w-4" />}>Next</Button>
          ) : (
            <Button type="submit" disabled={loading} icon={!loading && <Check className="h-4 w-4" />}>{loading ? <LoadingSpinner /> : "Complete"}</Button>
          )}
        </div>
      </form>
    </main>
  );
}
