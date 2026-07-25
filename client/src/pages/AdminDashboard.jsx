import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PageLoading } from "../components/RouteGuards";

const TABS = ["সারাংশ", "ঋণ আবেদন", "দান", "বার্তা"];

export default function AdminDashboard() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">অ্যাডমিন প্যানেল</p>
      <h1 className="text-3xl font-semibold text-forest mb-8">পরিচালনা কেন্দ্র</h1>

      <div className="flex gap-2 mb-8 border-b border-line overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t ? "border-forest text-forest" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "সারাংশ" && <SummaryTab />}
      {tab === "ঋণ আবেদন" && <LoansTab />}
      {tab === "দান" && <DonationsTab />}
      {tab === "বার্তা" && <MessagesTab />}
    </div>
  );
}

function SummaryTab() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAdminSummary().then(setSummary).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-clay text-sm">{error}</p>;
  if (!summary) return <PageLoading />;

  const cards = [
    ["মোট দানের পরিমাণ", `${summary.totalDonationAmount.toLocaleString("bn-BD")} টাকা`],
    ["মোট দান সংখ্যা", summary.donationCount],
    ["মোট ঋণ আবেদন", summary.loanCount],
    ["অপেক্ষমান ঋণ আবেদন", summary.pendingLoans],
    ["না পড়া বার্তা", summary.unreadMessages],
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map(([label, value]) => (
        <div key={label} className="card">
          <p className="text-sm text-ink/50 mb-2">{label}</p>
          <p className="text-2xl font-display font-semibold text-forest">{value}</p>
        </div>
      ))}
    </div>
  );
}

const loanStatuses = ["জমা হয়েছে", "পর্যালোচনাধীন", "অনুমোদিত", "প্রত্যাখ্যাত", "পরিশোধিত"];

function LoansTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.getLoanApplications().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.updateLoanApplication(id, { status });
      setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <p className="text-clay text-sm">{error}</p>;
  if (items.length === 0) return <p className="text-ink/50">কোনো আবেদন পাওয়া যায়নি।</p>;

  return (
    <div className="space-y-4">
      {items.map((a) => (
        <div key={a._id} className="card">
          <div className="flex flex-wrap justify-between gap-3 mb-2">
            <div>
              <h3 className="font-semibold text-forest">{a.applicantName}</h3>
              <p className="text-xs text-ink/50">{a.phone} · {a.address}</p>
            </div>
            <select
              className="input !w-auto text-sm"
              value={a.status}
              onChange={(e) => updateStatus(a._id, e.target.value)}
            >
              {loanStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-ink/70">
            উদ্দেশ্য: {a.purpose} · পরিমাণ: {a.requestedAmount.toLocaleString("bn-BD")} টাকা
          </p>
          {a.purposeDetails && <p className="text-sm text-ink/60 mt-1">{a.purposeDetails}</p>}
        </div>
      ))}
    </div>
  );
}

const donationStatuses = ["pending", "confirmed", "cancelled"];
const donationStatusLabel = { pending: "অপেক্ষমান", confirmed: "নিশ্চিত", cancelled: "বাতিল" };

function DonationsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDonations().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.updateDonationStatus(id, status);
      setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <p className="text-clay text-sm">{error}</p>;
  if (items.length === 0) return <p className="text-ink/50">কোনো দান পাওয়া যায়নি।</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink/50 border-b border-line">
            <th className="py-2 pr-4">দাতা</th>
            <th className="py-2 pr-4">খাত</th>
            <th className="py-2 pr-4">পরিমাণ</th>
            <th className="py-2 pr-4">অবস্থা</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d._id} className="border-b border-line/60">
              <td className="py-3 pr-4">
                <div className="font-medium text-ink">{d.donorName}</div>
                <div className="text-xs text-ink/50">{d.phone}</div>
              </td>
              <td className="py-3 pr-4">{d.category}</td>
              <td className="py-3 pr-4">{d.amount.toLocaleString("bn-BD")} টাকা</td>
              <td className="py-3 pr-4">
                <select
                  className="input !w-auto !py-1.5 text-xs"
                  value={d.status}
                  onChange={(e) => updateStatus(d._id, e.target.value)}
                >
                  {donationStatuses.map((s) => (
                    <option key={s} value={s}>{donationStatusLabel[s]}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessagesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getContactMessages().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.markMessageRead(id);
      setItems((prev) => prev.map((i) => (i._id === id ? { ...i, read: true } : i)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <p className="text-clay text-sm">{error}</p>;
  if (items.length === 0) return <p className="text-ink/50">কোনো বার্তা পাওয়া যায়নি।</p>;

  return (
    <div className="space-y-4">
      {items.map((m) => (
        <div key={m._id} className={`card ${!m.read ? "border-gold" : ""}`}>
          <div className="flex flex-wrap justify-between gap-3 mb-2">
            <div>
              <h3 className="font-semibold text-forest">{m.name} {!m.read && <span className="text-xs text-gold-dark ml-2">নতুন</span>}</h3>
              <p className="text-xs text-ink/50">{m.email} {m.phone && `· ${m.phone}`}</p>
            </div>
            {!m.read && (
              <button onClick={() => markRead(m._id)} className="text-xs font-semibold text-forest hover:underline">
                পঠিত হিসেবে চিহ্নিত করুন
              </button>
            )}
          </div>
          {m.subject && <p className="text-sm font-medium text-ink/80 mb-1">{m.subject}</p>}
          <p className="text-sm text-ink/65">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
