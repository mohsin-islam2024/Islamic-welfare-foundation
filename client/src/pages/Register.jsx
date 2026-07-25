import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setStatus({ loading: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" });
      return;
    }
    setStatus({ loading: true, error: "" });
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে।"
          : "নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setStatus({ loading: false, error: msg });
      return;
    }
    setStatus({ loading: false, error: "" });
  };

  const handleGoogle = async () => {
    setStatus({ loading: true, error: "" });
    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setStatus({ loading: false, error: "গুগল দিয়ে নিবন্ধন করতে সমস্যা হয়েছে।" });
      return;
    }
    setStatus({ loading: false, error: "" });
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="text-3xl font-semibold text-forest mb-2">নতুন একাউন্ট</h1>
      <p className="text-ink/60 mb-8 text-sm">
        কর্জে হাসানাহর জন্য আবেদন করতে বা আপনার আবেদন ট্র্যাক করতে একাউন্ট তৈরি করুন।
      </p>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label" htmlFor="name">পূর্ণ নাম</label>
          <input
            className="input"
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
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
          {status.loading ? "তৈরি হচ্ছে..." : "একাউন্ট তৈরি করুন"}
        </button>

        <div className="flex items-center gap-3 text-xs text-ink/40">
          <div className="h-px bg-line flex-1" /> অথবা <div className="h-px bg-line flex-1" />
        </div>

        <button type="button" onClick={handleGoogle} className="btn-secondary w-full" disabled={status.loading}>
          গুগল দিয়ে নিবন্ধন করুন
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        আগে থেকেই একাউন্ট আছে? <Link to="/login" className="text-forest font-semibold hover:underline">লগইন করুন</Link>
      </p>
    </div>
  );
}
