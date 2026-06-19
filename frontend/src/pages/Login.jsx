import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { getError } from "../services/api.js";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(getError(err));
    }
  }

  return (
    <AuthShell title="Login" subtitle="Analyze your next resume against the role you want.">
      <form className="space-y-4" onSubmit={submit}>
        {error && <p className="rounded-md bg-coral/10 p-3 text-sm text-coral">{error}</p>}
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading}><FiLogIn /> Login</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link></p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="panel w-full max-w-md p-6">
        <Link to="/" className="text-xl font-bold">ResumeIQ</Link>
        <h1 className="mt-8 text-2xl font-bold">{title}</h1>
        <p className="mb-6 mt-2 text-sm text-slate-500">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}
