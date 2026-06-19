import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { getError } from "../services/api.js";
import { AuthShell } from "./Login.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getError(err));
    }
  }

  return (
    <AuthShell title="Create Account" subtitle="Save analyses, compare progress, and download reports.">
      <form className="space-y-4" onSubmit={submit}>
        {error && <p className="rounded-md bg-coral/10 p-3 text-sm text-coral">{error}</p>}
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="candidate">Candidate</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn-primary w-full" disabled={loading}><FiUserPlus /> Register</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link className="font-semibold text-brand" to="/login">Login</Link></p>
    </AuthShell>
  );
}
