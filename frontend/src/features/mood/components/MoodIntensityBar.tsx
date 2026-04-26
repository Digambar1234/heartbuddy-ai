export function MoodIntensityBar({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-purple-100">
      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-purple-700" style={{ width: `${value * 10}%` }} />
    </div>
  );
}
