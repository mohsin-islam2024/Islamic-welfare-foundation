import { useState } from "react";
import { api } from "../lib/api";

const categories = [
  "সাধারণ দান",
  "যাকাত",
  "সদকা",
  "কর্জে হাসানাহ তহবিল",
  "কুরবানির চামড়া",
  "শিক্ষা সহায়তা",
  "চিকিৎসা সহায়তা",
  "দুর্যোগ ত্রাণ",
];

const initialForm = {
  donorName: "",
  phone: "",
  email: "",
  amount: "",
  category: categories[0],
  note: "",
};

export default function Donate() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await api.submitDonation({ ...form, amount: Number(form.amount) });
      setStatus({ loading: false, error: "", success: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">দান করুন</p>
      <h1 className="text-4xl font-semibold text-forest mb-4">আপনার দানের অঙ্গীকার</h1>
      <p className="text-ink/65 mb-10 leading-relaxed">
        নিচের ফর্মটি পূরণ করুন। জমা দেওয়ার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করে দান
        গ্রহণের প্রক্রিয়া সম্পন্ন করবেন। শরিয়াহসম্মত বৈধ উৎস থেকে দান গ্রহণ করা হয়।
      </p>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="donorName">পূর্ণ নাম *</label>
            <input
              className="input"
              id="donorName"
              name="donorName"
              value={form.donorName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">ফোন নম্বর *</label>
            <input
              className="input"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="email">ইমেইল (ঐচ্ছিক)</label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="amount">পরিমাণ (টাকা) *</label>
            <input
              className="input"
              id="amount"
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="category">খাত</label>
          <select
            className="input"
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="note">মন্তব্য (ঐচ্ছিক)</label>
          <textarea
            className="input"
            id="note"
            name="note"
            rows={3}
            value={form.note}
            onChange={handleChange}
          />
        </div>

        {status.error && (
          <p className="text-clay text-sm font-medium">{status.error}</p>
        )}
        {status.success && (
          <p className="text-forest text-sm font-medium">{status.success}</p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={status.loading}>
          {status.loading ? "জমা হচ্ছে..." : "দানের অঙ্গীকার জমা দিন"}
        </button>
      </form>
    </div>
  );
}
