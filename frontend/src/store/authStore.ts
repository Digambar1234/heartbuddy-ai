import { create } from "zustand";
import { authApi, settingsApi } from "../services/api";
import type { Profile, User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  profile: Profile | null;
  isBootstrapping: boolean;
  setSession: (token: string, user: User) => void;
  setUser: (user: User) => void;
  setProfile: (profile: Profile | null) => void;
  bootstrap: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("heartbuddy_token"),
  user: null,
  profile: null,
  isBootstrapping: true,
  setSession: (token, user) => {
    localStorage.setItem("heartbuddy_token", token);
    set({ token, user });
  },
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  bootstrap: async () => {
    const token = get().token;
    if (!token) {
      set({ isBootstrapping: false });
      return;
    }
    try {
      const user = await authApi.me();
      let profile: Profile | null = null;
      if (user.onboarding_completed) {
        profile = await settingsApi.getProfile();
      }
      set({ user, profile, isBootstrapping: false });
    } catch {
      localStorage.removeItem("heartbuddy_token");
      set({ token: null, user: null, profile: null, isBootstrapping: false });
    }
  },
  logout: () => {
    localStorage.removeItem("heartbuddy_token");
    set({ token: null, user: null, profile: null });
  },
}));
