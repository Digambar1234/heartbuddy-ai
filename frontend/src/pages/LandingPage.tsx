import { ArrowRight, Brain, CheckCircle2, Heart, LockKeyhole, MessageCircleHeart, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const features = [
  { icon: Brain, title: "Memory that feels personal", text: "HeartBuddy remembers meaningful goals, preferences, triggers, wins, and emotional patterns." },
  { icon: MessageCircleHeart, title: "Companion modes", text: "Best friend, calm listener, coach, or safe romantic companion with healthy boundaries." },
  { icon: TrendingUp, title: "Mood journey", text: "Track emotional states over time and notice what is helping or hurting your day." },
  { icon: LockKeyhole, title: "Privacy controls", text: "Edit, deactivate, delete, and export memories anytime. You stay in control." },
];

export default function LandingPage() {
  return (
    <main className="premium-bg min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
        <Link to="/" className="flex items-center gap-3 text-xl font-black text-purple-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-purple-700 text-white shadow-glow">
            <Heart className="h-5 w-5" />
          </span>
          HeartBuddy AI
        </Link>
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <Link to="/login"><Button variant="secondary" className="px-4">Login</Button></Link>
          <Link to="/register"><Button className="px-4" icon={<ArrowRight className="h-4 w-4" />}>Start</Button></Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Badge>Memory-aware emotional companion</Badge>
          <h1 className="text-balance mt-6 text-5xl font-black leading-[0.96] text-purple-950 md:text-7xl">
            Meet HeartBuddy AI
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700">
            A private companion space for supportive chat, mood check-ins, and memories that make each conversation feel more personal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register"><Button icon={<ArrowRight className="h-4 w-4" />}>Start your companion</Button></Link>
            <Link to="/login"><Button variant="secondary">I already have an account</Button></Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Memory-aware", "Mood tracking", "Privacy control"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/74 px-4 py-3 text-sm font-black text-slate-800 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.45 }}>
          <div className="hero-sheen relative rounded-[2rem] p-3 shadow-glow">
            <img src="/assets/heartbuddy-3d-companion.png" alt="3D HeartBuddy AI companion visual" className="aspect-[1.08] w-full rounded-[1.75rem] object-cover" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-rose-500" />
                <p className="font-black text-purple-950">Memory-powered support</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">A caring companion designed to remember what matters without replacing real-world support.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-5 md:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-rose-500 shadow-sm ring-1 ring-rose-100">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-black text-purple-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-amber-200 bg-amber-50/80">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p className="font-semibold text-amber-900">
            HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.
          </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
