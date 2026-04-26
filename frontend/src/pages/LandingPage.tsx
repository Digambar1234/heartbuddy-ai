import { ArrowRight, Brain, Heart, LockKeyhole, MessageCircleHeart, Sparkles, TrendingUp } from "lucide-react";
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-3 text-xl font-black text-purple-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-purple-700 text-white shadow-glow">
            <Heart className="h-5 w-5" />
          </span>
          HeartBuddy AI
        </Link>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="secondary">Login</Button></Link>
          <Link to="/register"><Button icon={<ArrowRight className="h-4 w-4" />}>Get Started</Button></Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Badge>Personal emotional companion</Badge>
          <h1 className="text-balance mt-6 text-5xl font-black leading-[0.96] text-purple-950 md:text-7xl">
            Meet HeartBuddy AI
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700">
            Your personal AI companion who remembers you, understands you, and supports you every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register"><Button icon={<ArrowRight className="h-4 w-4" />}>Start your companion</Button></Link>
            <Link to="/login"><Button variant="secondary">I already have an account</Button></Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Memory-aware", "Safety-first", "Privacy control"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-black text-purple-900 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.45 }}>
          <div className="hero-sheen relative rounded-[2.25rem] p-4 shadow-glow">
            <img src="/assets/heartbuddy-3d-companion.png" alt="3D HeartBuddy AI companion visual" className="aspect-[1.08] w-full rounded-[1.75rem] object-cover" />
            <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/70 bg-white/76 p-5 shadow-xl backdrop-blur-xl">
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
              <feature.icon className="h-8 w-8 text-rose-500" />
              <h3 className="mt-5 text-lg font-black text-purple-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-amber-200 bg-amber-50/80">
          <p className="font-semibold text-amber-900">
            HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.
          </p>
        </Card>
      </section>
    </main>
  );
}
