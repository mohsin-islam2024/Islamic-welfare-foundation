import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "" });
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setStatus({ loading: false, error: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।" });
      return;
    }
    setStatus({ loading: false, error: "" });
  };

  const handleGoogle = async () => {
    setStatus({ loading: true, error: "" });
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setStatus({ loading: false, error: "গুগল দিয়ে লগইন করতে সমস্যা হয়েছে।" });
      return;
    }
    setStatus({ loading: false, error: "" });
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="text-3xl font-semibold text-forest mb-2">লগইন করুন</h1>
      <p className="text-ink/60 mb-8 text-sm">আপনার একাউন্টে প্রবেশ করুন।</p>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label" htmlFor="email">ইমেইল</label>
          <input
            className="input"
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="password">পাসওয়ার্ড</label>
          <input
            className="input"
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>

        {status.error && <p className="text-clay text-sm font-medium">{status.error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={status.loading}>
          {status.loading ? "লগইন হচ্ছে..." : "লগইন"}
        </button>

        <div className="flex items-center gap-3 text-xs text-ink/40">
          <div className="h-px bg-line flex-1" /> অথবা <div className="h-px bg-line flex-1" />
        </div>

        <button type="button" onClick={handleGoogle} className="btn-secondary w-full" disabled={status.loading}>
          গুগল দিয়ে লগইন করুন
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        একাউন্ট নেই? <Link to="/register" className="text-forest font-semibold hover:underline">নিবন্ধন করুন</Link>
      </p>
    </div>
  );
}
