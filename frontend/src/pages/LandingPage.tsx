import { ArrowRight, Brain, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const features = [
  { icon: Brain, title: "Long-term personalization", text: "A foundation built for memories, emotional patterns, goals, and preferences." },
  { icon: Sparkles, title: "Companion style", text: "Choose a Best Friend, Romantic Partner, Motivational Coach, or Calm Listener." },
  { icon: LockKeyhole, title: "Safety-first product", text: "Clear boundaries, responsible positioning, and privacy-conscious architecture." },
];

export default function LandingPage() {
  return (
    <main className="premium-bg min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-3 text-xl font-black text-purple-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-glow">
            <Heart className="h-5 w-5" />
          </span>
          HeartBuddy AI
        </Link>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="secondary">Login</Button></Link>
          <Link to="/register"><Button icon={<ArrowRight className="h-4 w-4" />}>Get Started</Button></Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Badge>Emotional companion SaaS</Badge>
          <h1 className="mt-6 text-5xl font-black leading-tight text-purple-950 md:text-7xl">Meet HeartBuddy AI</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700">
            Your personal AI companion who remembers you, understands you, and supports you every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register"><Button icon={<ArrowRight className="h-4 w-4" />}>Get Started</Button></Link>
            <Link to="/login"><Button variant="secondary">Login</Button></Link>
          </div>
          <p className="mt-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm font-medium text-amber-800">
            HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="relative p-8">
            <div className="rounded-[1.75rem] bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 p-1">
              <div className="rounded-[1.55rem] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-rose-600">Companion preview</p>
                    <h2 className="mt-1 text-3xl font-black text-purple-950">HeartBuddy</h2>
                  </div>
                  <Heart className="h-10 w-10 text-rose-500" />
                </div>
                <div className="mt-8 space-y-4">
                  {["I remember what matters to you.", "I can listen calmly or help you take action.", "I keep clear emotional boundaries."].map((text) => (
                    <div key={text} className="rounded-2xl bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-900">
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-16 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <feature.icon className="h-8 w-8 text-rose-500" />
            <h3 className="mt-5 text-xl font-black text-purple-950">{feature.title}</h3>
            <p className="mt-3 text-slate-600">{feature.text}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
