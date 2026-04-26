import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { token, user, isBootstrapping } = useAuthStore();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="premium-bg grid min-h-screen place-items-center text-sm font-semibold text-purple-900">
        Loading HeartBuddy AI...
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireOnboarding && !user.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOnboarding && user.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
