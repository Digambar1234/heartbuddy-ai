import { api } from "../../services/api";

export const privacyService = {
  exportData: () => api.get("/privacy/export-data").then((res) => res.data),
  deleteMemories: () => api.post<{ deleted_count: number }>("/privacy/delete-memories", { confirm: true }).then((res) => res.data),
  deleteMoodLogs: () => api.post<{ deleted_count: number }>("/privacy/delete-mood-logs", { confirm: true }).then((res) => res.data),
};
