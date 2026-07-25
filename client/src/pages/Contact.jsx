import { useState } from "react";
import { api } from "../lib/api";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
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
      const res = await api.submitContact(form);
      setStatus({ loading: false, error: "", success: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <p className="eyebrow mb-3">যোগাযোগ</p>
        <h1 className="text-4xl font-semibold text-forest mb-6">আমাদের সাথে যোগাযোগ করুন</h1>
        <p className="text-ink/65 leading-relaxed mb-8">
          কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রস্তাব থাকলে নিচের ফর্মে বার্তা পাঠান। আমরা যত দ্রুত
          সম্ভব সাড়া দেব।
        </p>
        <div className="card">
          <h3 className="font-semibold text-forest mb-2">ঠিকানা</h3>
          <p className="text-sm text-ink/65 leading-relaxed">
            গ্রাম: সোটাহার, ডাকঘর: ধারকি
            <br />
            উপজেলা: জয়পুরহাট সদর, জেলা: জয়পুরহাট
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 h-fit">
        <div>
          <label className="label" htmlFor="name">নাম *</label>
          <input className="input" id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="email">ইমেইল</label>
            <input className="input" id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="phone">ফোন নম্বর</label>
            <input className="input" id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="subject">বিষয়</label>
          <input className="input" id="subject" name="subject" value={form.subject} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="message">বার্তা *</label>
          <textarea className="input" id="message" name="message" rows={4} value={form.message} onChange={handleChange} required />
        </div>

        {status.error && <p className="text-clay text-sm font-medium">{status.error}</p>}
        {status.success && <p className="text-forest text-sm font-medium">{status.success}</p>}

        <button type="submit" className="btn-primary w-full" disabled={status.loading}>
          {status.loading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
        </button>
      </form>
    </div>
  );
}
