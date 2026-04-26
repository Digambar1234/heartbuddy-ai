import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { authApi, getApiError } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login(form);
      setSession(response.access_token, response.user);
      navigate(response.user.onboarding_completed ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-3xl font-black text-purple-950">Welcome back</h1>
        <p className="mt-2 text-slate-600">Login to continue building your companion profile.</p>
        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <ErrorMessage message={error} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button className="w-full" disabled={loading}>{loading ? <LoadingSpinner /> : "Login"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New to HeartBuddy? <Link className="font-bold text-purple-700" to="/register">Create account</Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
