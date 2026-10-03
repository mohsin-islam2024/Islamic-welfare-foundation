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

const REFERENCE = "AIF";

const methods = {
  bkash: { label: "বিকাশ", number: "01317401686", color: "#E2136E" },
  nagad: { label: "নগদ", number: "01335571310", color: "#F6921E" },
};

const initialForm = {
  donorName: "",
  phone: "",
  email: "",
  amount: "",
  category: categories[0],
  paymentMethod: "bkash",
  senderNumber: "",
  trxId: "",
  note: "",
};

export default function Donate() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [copied, setCopied] = useState("");

  const method = methods[form.paymentMethod];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard অনুমতি না থাকলে কিছু হবে না */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await api.submitDonation({
        ...form,
        amount: Number(form.amount),
        trxId: form.trxId.trim().toUpperCase(),
      });
      setStatus({ loading: false, error: "", success: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">দান করুন</p>
      <h1 className="text-4xl font-semibold text-forest mb-4">সরাসরি দান করুন</h1>
      <p className="text-ink/65 mb-8 leading-relaxed">
        প্রথমে নিচের বিকাশ বা নগদ নম্বরে Send Money করুন, তারপর টাকা পাঠানোর TrxID সহ ফর্মটি জমা
        দিন। আমরা TrxID মিলিয়ে দান নিশ্চিত করব। শরিয়াহসম্মত বৈধ উৎস থেকে দান গ্রহণ করা হয়।
      </p>

      {/* Step 1: pay */}
      <div className="card mb-8">
        <h2 className="font-display font-semibold text-lg text-forest mb-4">ধাপ ১: টাকা পাঠান</h2>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {Object.entries(methods).map(([key, m]) => {
            const active = form.paymentMethod === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setForm((f) => ({ ...f, paymentMethod: key }))}
                aria-pressed={active}
                className="rounded-md border-2 px-4 py-3 text-left transition-colors bg-white"
                style={{ borderColor: active ? m.color : "#E4DCC8" }}
              >
                <span className="block font-semibold" style={{ color: m.color }}>
                  {m.label}
                </span>
                <span className="block text-xs text-ink/50 mt-0.5">Send Money</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-md bg-white border border-line p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-ink/50 mb-0.5">{method.label} নম্বর (Personal)</p>
              <p className="text-xl font-semibold tracking-wide" style={{ color: method.color }}>
                {method.number}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(method.number, "number")}
              className="text-xs font-semibold text-forest border border-forest rounded px-3 py-1.5 hover:bg-forest hover:text-canvas transition-colors"
            >
              {copied === "number" ? "কপি হয়েছে" : "নম্বর কপি"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
            <div>
              <p className="text-xs text-ink/50 mb-0.5">Reference</p>
              <p className="text-lg font-semibold text-ink">{REFERENCE}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(REFERENCE, "ref")}
              className="text-xs font-semibold text-forest border border-forest rounded px-3 py-1.5 hover:bg-forest hover:text-canvas transition-colors"
            >
              {copied === "ref" ? "কপি হয়েছে" : "কপি"}
            </button>
          </div>
        </div>

        <p className="text-xs text-ink/55 mt-3 leading-relaxed">
          অ্যাপের <strong>Send Money</strong> অপশন ব্যবহার করুন এবং Reference ঘরে <strong>{REFERENCE}</strong> লিখুন।
          টাকা পাঠানো হলে SMS বা অ্যাপে প্রাপ্ত <strong>TrxID</strong> সংরক্ষণ করুন।
        </p>
      </div>

      {/* Step 2: submit */}
      <form onSubmit={handleSubmit} className="card space-y-5">
        <h2 className="font-display font-semibold text-lg text-forest">ধাপ ২: তথ্য ও TrxID জমা দিন</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="donorName">পূর্ণ নাম *</label>
            <input className="input" id="donorName" name="donorName" value={form.donorName} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="phone">যোগাযোগের ফোন নম্বর *</label>
            <input className="input" id="phone" name="phone" inputMode="tel" value={form.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="email">ইমেইল (ঐচ্ছিক)</label>
            <input className="input" id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="amount">পাঠানো টাকার পরিমাণ *</label>
            <input className="input" id="amount" name="amount" type="number" min="1" value={form.amount} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="senderNumber">
              যে {method.label} নম্বর থেকে পাঠিয়েছেন *
            </label>
            <input
              className="input"
              id="senderNumber"
              name="senderNumber"
              inputMode="numeric"
              pattern="01[3-9][0-9]{8}"
              placeholder="01XXXXXXXXX"
              title="১১ সংখ্যার মোবাইল নম্বর, যেমন 01712345678"
              value={form.senderNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="trxId">TrxID (ট্রানজেকশন আইডি) *</label>
            <input
              className="input uppercase"
              id="trxId"
              name="trxId"
              placeholder="যেমন: 8N7A6D5EF2"
              pattern="[A-Za-z0-9]{6,20}"
              title="ইংরেজি অক্ষর ও সংখ্যা, ৬-২০ ঘর"
              autoComplete="off"
              value={form.trxId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="category">খাত</label>
          <select className="input" id="category" name="category" value={form.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="note">মন্তব্য (ঐচ্ছিক)</label>
          <textarea className="input" id="note" name="note" rows={3} value={form.note} onChange={handleChange} />
        </div>

        {status.error && <p className="text-clay text-sm font-medium">{status.error}</p>}
        {status.success && <p className="text-forest text-sm font-medium">{status.success}</p>}

        <button type="submit" className="btn-primary w-full" disabled={status.loading}>
          {status.loading ? "জমা হচ্ছে..." : "দান জমা দিন"}
        </button>
      </form>
    </div>
  );
}
