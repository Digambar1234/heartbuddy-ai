import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Card } from "../ui/Card";

export function OnboardingStepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black text-purple-950">{title}</h1>
        {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
        <div className="mt-7 space-y-5">{children}</div>
      </Card>
    </motion.div>
  );
}
