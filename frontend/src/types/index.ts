export type CompanionGender = "female" | "male" | "neutral";
export type CompanionMode = "friend" | "romantic_partner" | "coach" | "listener";
export type CompanionTone =
  | "soft"
  | "playful"
  | "mature"
  | "motivational"
  | "calm"
  | "strict_supportive";

export interface User {
  id: string;
  name: string;
  email: string;
  gender: string | null;
  date_of_birth: string | null;
  age_confirmed: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  companion_name: string;
  companion_gender: CompanionGender;
  companion_mode: CompanionMode;
  companion_tone: CompanionTone;
  user_support_preference: string | null;
  emotional_boundaries: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export type Sender = "user" | "assistant" | "system";
export type RiskLevel = "normal" | "sensitive" | "crisis";

export interface Memory {
  id: string;
  user_id: string;
  memory_text: string;
  memory_type: string;
  emotion: string | null;
  importance_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
}

export interface MemoryExport {
  exported_at: string;
  user_id: string;
  memories: Memory[];
}

export type MoodValue =
  | "happy"
  | "proud"
  | "calm"
  | "sad"
  | "lonely"
  | "anxious"
  | "angry"
  | "heartbroken"
  | "demotivated"
  | "stressed"
  | "confused"
  | "neutral";

export interface MoodLog {
  id: string;
  user_id: string;
  mood: MoodValue;
  intensity: number;
  reason: string | null;
  created_at: string;
}

export interface MoodSummary {
  total_logs: number;
  most_common_mood: string | null;
  average_intensity: number | null;
  recent_mood: string | null;
  recent_intensity: number | null;
  common_triggers: string[];
  last_7_days: Array<{ date: string; average_intensity: number; dominant_mood: string }>;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: Sender;
  content: string;
  emotion_detected: string | null;
  risk_level: RiskLevel;
  memories_used_count: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

export interface ChatResponse {
  conversation_id: string;
  user_message_id: string;
  assistant_message_id: string;
  assistant_message: string;
  emotion_detected: string;
  risk_level: RiskLevel;
  memories_used: Memory[];
  new_memories_saved: Memory[];
  used_fallback_response: boolean;
}

export interface OnboardingPayload {
  gender: string | null;
  age_confirmed: boolean;
  companion_name: string;
  companion_gender: CompanionGender;
  companion_mode: CompanionMode;
  companion_tone: CompanionTone;
  user_support_preference: string | null;
  emotional_boundaries: string | null;
  initial_goal_text?: string | null;
  initial_memory_text?: string | null;
}
