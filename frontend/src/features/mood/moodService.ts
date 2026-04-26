import { api } from "../../services/api";
import type { MoodLog, MoodSummary, MoodValue } from "./moodTypes";

export const moodService = {
  create: (payload: { mood: MoodValue; intensity: number; reason?: string | null }) =>
    api.post<MoodLog>("/mood", payload).then((res) => res.data),
  list: () => api.get<MoodLog[]>("/mood").then((res) => res.data),
  summary: () => api.get<MoodSummary>("/mood/summary").then((res) => res.data),
  remove: (id: string) => api.delete(`/mood/${id}`),
};
