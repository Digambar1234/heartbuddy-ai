import type { CompanionMode, CompanionTone } from "../types";

export const modeLabels: Record<CompanionMode, string> = {
  friend: "Best Friend",
  romantic_partner: "Romantic Partner",
  coach: "Motivational Coach",
  listener: "Calm Listener",
};

export const toneLabels: Record<CompanionTone, string> = {
  soft: "Soft and caring",
  playful: "Playful and affectionate",
  mature: "Mature and wise",
  motivational: "Motivational",
  calm: "Calm and gentle",
  strict_supportive: "Strict but supportive",
};

export const genderLabels = {
  female: "Female companion",
  male: "Male companion",
  neutral: "Neutral companion",
};
