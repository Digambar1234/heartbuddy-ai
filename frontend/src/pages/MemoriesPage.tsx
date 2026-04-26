import { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { AddMemoryForm } from "../features/memories/components/AddMemoryForm";
import { DeleteAllMemoriesModal } from "../features/memories/components/DeleteAllMemoriesModal";
import { ExportMemoriesButton } from "../features/memories/components/ExportMemoriesButton";
import { MemoryCard } from "../features/memories/components/MemoryCard";
import { MemoryEditorModal } from "../features/memories/components/MemoryEditorModal";
import { MemoryFilters } from "../features/memories/components/MemoryFilters";
import { memoryService, type MemoryPayload } from "../features/memories/memoryService";
import type { Memory } from "../features/memories/memoryTypes";
import { getApiError } from "../services/api";

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState("");
  const [memoryType, setMemoryType] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [editing, setEditing] = useState<Memory | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setMemories(await memoryService.list({ search, memory_type: memoryType || undefined, active_only: activeOnly }));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [search, memoryType, activeOnly]);

  async function addMemory(payload: MemoryPayload) {
    try {
      await memoryService.create(payload);
      setSuccess("Memory added.");
      await load();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function updateMemory(payload: Required<MemoryPayload>) {
    if (!editing) return;
    try {
      await memoryService.update(editing.id, payload);
      setEditing(null);
      setSuccess("Memory updated.");
      await load();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function toggleMemory(memory: Memory) {
    await (memory.is_active ? memoryService.deactivate(memory.id) : memoryService.activate(memory.id));
    await load();
  }

  async function deleteMemory(memory: Memory) {
    if (!window.confirm("Delete this memory permanently?")) return;
    await memoryService.remove(memory.id);
    await load();
  }

  async function deleteAll() {
    await memoryService.deleteAll();
    setDeleteAllOpen(false);
    setSuccess("All memories deleted.");
    await load();
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-purple-950">HeartBuddy’s Memory</h1>
          <p className="mt-3 max-w-2xl text-slate-700">HeartBuddy uses these memories to support you personally. You are always in control.</p>
        </div>
        <ExportMemoriesButton />
      </div>
      <Card className="mb-6">
        <p className="mb-5 rounded-2xl bg-indigo-50 p-4 text-sm font-semibold text-indigo-800">You can edit, deactivate, delete, or export your memories anytime.</p>
        <MemoryFilters search={search} memoryType={memoryType} activeOnly={activeOnly} onChange={(filters) => {
          if (filters.search !== undefined) setSearch(filters.search);
          if (filters.memoryType !== undefined) setMemoryType(filters.memoryType);
          if (filters.activeOnly !== undefined) setActiveOnly(filters.activeOnly);
        }} />
      </Card>
      <Card className="mb-6"><AddMemoryForm loading={loading} onAdd={(payload) => void addMemory(payload)} /></Card>
      <ErrorMessage message={error} />
      {success && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{success}</div>}
      {memories.length === 0 ? (
        <Card><p className="text-slate-600">HeartBuddy has not remembered anything yet. Important memories will appear here when you share meaningful life events, goals, preferences, or emotional patterns.</p></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} onEdit={setEditing} onToggle={(item) => void toggleMemory(item)} onDelete={(item) => void deleteMemory(item)} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <Button variant="danger" onClick={() => setDeleteAllOpen(true)}>Delete all memories</Button>
      </div>
      <MemoryEditorModal memory={editing} onClose={() => setEditing(null)} onSave={(payload) => void updateMemory(payload)} />
      <DeleteAllMemoriesModal open={deleteAllOpen} onClose={() => setDeleteAllOpen(false)} onConfirm={() => void deleteAll()} />
    </AppLayout>
  );
}
