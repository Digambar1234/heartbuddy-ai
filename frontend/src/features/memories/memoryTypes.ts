export type { Memory, MemoryExport } from "../../types";

export const memoryTypeOptions = [
  "personal_fact",
  "emotional_event",
  "goal",
  "fear",
  "preference",
  "relationship_context",
  "achievement",
  "negative_pattern",
  "positive_pattern",
  "trigger",
  "coping_strategy",
] as const;

export type MemoryType = (typeof memoryTypeOptions)[number];
