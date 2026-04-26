import { api } from "../../services/api";
import type { Memory, MemoryExport } from "./memoryTypes";

export interface MemoryPayload {
  memory_text: string;
  memory_type: string;
  emotion: string | null;
  importance_score: number;
  is_active?: boolean;
}

export interface MemoryFilters {
  memory_type?: string;
  emotion?: string;
  active_only?: boolean;
  search?: string;
}

export const memoryService = {
  list: (filters: MemoryFilters = {}) =>
    api.get<Memory[]>("/memories", { params: filters }).then((res) => res.data),
  create: (payload: MemoryPayload) => api.post<Memory>("/memories", payload).then((res) => res.data),
  update: (id: string, payload: Required<MemoryPayload>) =>
    api.put<Memory>(`/memories/${id}`, payload).then((res) => res.data),
  remove: (id: string) => api.delete(`/memories/${id}`),
  activate: (id: string) => api.post<Memory>(`/memories/${id}/activate`).then((res) => res.data),
  deactivate: (id: string) => api.post<Memory>(`/memories/${id}/deactivate`).then((res) => res.data),
  deleteAll: () => api.post<{ deleted_count: number }>("/memories/delete-all", { confirm: true }).then((res) => res.data),
  export: () => api.get<MemoryExport>("/memories/export").then((res) => res.data),
};
