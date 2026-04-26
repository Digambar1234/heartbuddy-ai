import axios, { AxiosError } from "axios";
import type { AuthResponse, OnboardingPayload, Profile, User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("heartbuddy_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      localStorage.removeItem("heartbuddy_token");
    }
    return Promise.reject(error);
  },
);

export function getApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    const validationErrors = error.response?.data?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return validationErrors.map((item) => item.msg).join(" ");
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", payload).then((res) => res.data),
  login: (payload: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", payload).then((res) => res.data),
  me: () => api.get<User>("/auth/me").then((res) => res.data),
};

export const onboardingApi = {
  complete: (payload: OnboardingPayload) =>
    api.post<{ user: User; profile: Profile }>("/onboarding/complete", payload).then((res) => res.data),
};

export const settingsApi = {
  getProfile: () => api.get<Profile>("/settings/profile").then((res) => res.data),
  updateProfile: (payload: Partial<Profile>) =>
    api.put<Profile>("/settings/profile", payload).then((res) => res.data),
};
