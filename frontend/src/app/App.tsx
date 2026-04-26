import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import ChatPage from "../pages/ChatPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import MemoriesPage from "../pages/MemoriesPage";
import MoodPage from "../pages/MoodPage";
import OnboardingPage from "../pages/OnboardingPage";
import PrivacyPage from "../pages/PrivacyPage";
import RegisterPage from "../pages/RegisterPage";
import SettingsPage from "../pages/SettingsPage";
import { useAuthStore } from "../store/authStore";

export default function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarding={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/memories"
        element={
          <ProtectedRoute>
            <MemoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mood"
        element={
          <ProtectedRoute>
            <MoodPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/privacy"
        element={
          <ProtectedRoute>
            <PrivacyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
