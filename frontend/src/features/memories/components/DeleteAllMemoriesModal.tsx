import { Button } from "../../../components/ui/Button";

export function DeleteAllMemoriesModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-purple-950/35 px-4 backdrop-blur-sm">
      <div className="max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-black text-rose-700">Delete all memories?</h2>
        <p className="mt-3 text-slate-600">This permanently removes everything HeartBuddy remembers about you. This cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete all</Button>
        </div>
      </div>
    </div>
  );
}
