import { useState } from "react";
import { api } from "../lib/api";

const purposes = ["ব্যবসা", "শিক্ষা", "চিকিৎসা", "জরুরি পারিবারিক প্রয়োজন", "কৃষিকাজ", "অন্যান্য"];

const initialForm = {
  applicantName: "",
  fatherOrHusbandName: "",
  phone: "",
  address: "",
  purpose: purposes[0],
  purposeDetails: "",
  requestedAmount: "",
  incomeSource: "",
  monthlyIncome: "",
  repaymentPlan: "",
};

export default function LoanApplication() {
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
      const res = await api.submitLoanApplication({
        ...form,
        requestedAmount: Number(form.requestedAmount),
        monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : undefined,
      });
      setStatus({ loading: false, error: "", success: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">কর্জে হাসানাহ</p>
      <h1 className="text-4xl font-semibold text-forest mb-4">সুদমুক্ত ঋণের আবেদন</h1>
      <p className="text-ink/65 mb-10 leading-relaxed">
        গঠনতন্ত্র অনুযায়ী প্রতিটি আবেদন ঋণ কমিটি স্বচ্ছভাবে মূল্যায়ন করে। সঠিক ও সম্পূর্ণ তথ্য প্রদান
        করলে মূল্যায়ন প্রক্রিয়া দ্রুত সম্পন্ন হয়।
      </p>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="applicantName">আবেদনকারীর নাম *</label>
            <input className="input" id="applicantName" name="applicantName" value={form.applicantName} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="fatherOrHusbandName">পিতা/স্বামীর নাম</label>
            <input className="input" id="fatherOrHusbandName" name="fatherOrHusbandName" value={form.fatherOrHusbandName} onChange={handleChange} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="phone">ফোন নম্বর *</label>
            <input className="input" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="requestedAmount">প্রয়োজনীয় অর্থের পরিমাণ (টাকা) *</label>
            <input className="input" id="requestedAmount" name="requestedAmount" type="number" min="1" value={form.requestedAmount} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="address">বর্তমান ঠিকানা *</label>
          <textarea className="input" id="address" name="address" rows={2} value={form.address} onChange={handleChange} required />
        </div>

        <div>
          <label className="label" htmlFor="purpose">ঋণের উদ্দেশ্য *</label>
          <select className="input" id="purpose" name="purpose" value={form.purpose} onChange={handleChange}>
            {purposes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="purposeDetails">উদ্দেশ্যের বিস্তারিত বিবরণ</label>
          <textarea className="input" id="purposeDetails" name="purposeDetails" rows={3} value={form.purposeDetails} onChange={handleChange} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="incomeSource">আয়ের উৎস</label>
            <input className="input" id="incomeSource" name="incomeSource" value={form.incomeSource} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="monthlyIncome">মাসিক আয় (টাকা)</label>
            <input className="input" id="monthlyIncome" name="monthlyIncome" type="number" min="0" value={form.monthlyIncome} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="repaymentPlan">সম্ভাব্য পরিশোধ পরিকল্পনা</label>
          <textarea className="input" id="repaymentPlan" name="repaymentPlan" rows={2} value={form.repaymentPlan} onChange={handleChange} />
        </div>

        {status.error && <p className="text-clay text-sm font-medium">{status.error}</p>}
        {status.success && <p className="text-forest text-sm font-medium">{status.success}</p>}

        <button type="submit" className="btn-primary w-full" disabled={status.loading}>
          {status.loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
        </button>
      </form>
    </div>
  );
}
