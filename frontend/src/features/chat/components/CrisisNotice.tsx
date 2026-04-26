export function CrisisNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
      If you are in immediate danger, contact local emergency support or someone you trust right now.
    </div>
  );
}
