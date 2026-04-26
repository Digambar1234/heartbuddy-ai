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

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const response = await authApi.register({ name: form.name, email: form.email, password: form.password });
      setSession(response.access_token, response.user);
      navigate("/onboarding");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-3xl font-black text-purple-950">Create your account</h1>
        <p className="mt-2 text-slate-600">Start by creating a private HeartBuddy AI profile.</p>
        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <ErrorMessage message={error} />
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button className="w-full" disabled={loading}>{loading ? <LoadingSpinner /> : "Register"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link className="font-bold text-purple-700" to="/login">Login</Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
