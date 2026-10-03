import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { socket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";
import { PageLoading } from "../components/RouteGuards";

const TABS = ["সারাংশ", "লাইভ চ্যাট", "নোটিশ", "ঋণ আবেদন", "দান", "বার্তা"];

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
      {tab === "লাইভ চ্যাট" && <ChatAdminTab />}
      {tab === "নোটিশ" && <NoticesTab />}
      {tab === "ঋণ আবেদন" && <LoansTab />}
      {tab === "দান" && <DonationsTab />}
      {tab === "বার্তা" && <MessagesTab />}
    </div>
  );
}

function ChatAdminTab() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const activeConv = conversations.find((c) => c._id === activeId);

  // Authenticate this socket as an admin, then load the conversation list
  useEffect(() => {
    if (!socket.connected) socket.connect();

    user.getIdToken().then((token) => {
      socket.emit("admin_join", token);
    });

    api
      .getConversations()
      .then(setConversations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Live updates: new messages append to the open thread; conversation list re-sorts on any update
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) =>
        message.conversation === activeId && !prev.some((m) => m._id === message._id)
          ? [...prev, message]
          : prev
      );
    };
    const handleConvUpdated = (conv) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === conv._id);
        const next = exists ? prev.map((c) => (c._id === conv._id ? conv : c)) : [conv, ...prev];
        return [...next].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("conversation_updated", handleConvUpdated);
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("conversation_updated", handleConvUpdated);
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (id) => {
    setActiveId(id);
    socket.emit("admin_join_conversation", id);
    try {
      const data = await api.getChatMessages(id);
      setMessages(data.messages);
    } catch (e) {
      alert(e.message);
    }
  };

  const sendReply = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    socket.emit("admin_message", { conversationId: activeId, text: text.trim() });
    setText("");
  };

  const closeConversation = async () => {
    if (!activeId || !confirm("এই কথোপকথন বন্ধ করতে চান?")) return;
    try {
      const updated = await api.closeConversation(activeId);
      setConversations((prev) => prev.map((c) => (c._id === activeId ? updated : c)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <p className="text-clay text-sm">{error}</p>;

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-5 h-[560px]">
      <div className="border border-line rounded-lg overflow-y-auto bg-white">
        {conversations.length === 0 && (
          <p className="text-ink/50 text-sm p-4">এখনো কোনো চ্যাট নেই।</p>
        )}
        {conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => openConversation(c._id)}
            className={`w-full text-left px-4 py-3 border-b border-line/60 hover:bg-canvas transition-colors ${
              activeId === c._id ? "bg-gold/10" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm text-forest truncate">{c.visitorName}</span>
              {c.unreadByAdmin > 0 && (
                <span className="shrink-0 bg-clay text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {c.unreadByAdmin}
                </span>
              )}
            </div>
            <p className="text-xs text-ink/50 truncate mt-0.5">{c.lastMessagePreview || "—"}</p>
            <p className="text-[10px] text-ink/35 mt-1">
              {c.status === "closed" ? "বন্ধ" : "সচল"} · {new Date(c.lastMessageAt).toLocaleString("bn-BD")}
            </p>
          </button>
        ))}
      </div>

      <div className="border border-line rounded-lg bg-white flex flex-col overflow-hidden">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-ink/40 text-sm">
            বাম দিক থেকে একটা কথোপকথন নির্বাচন করুন
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <div>
                <p className="font-semibold text-forest text-sm">{activeConv.visitorName}</p>
                {activeConv.visitorEmail && <p className="text-xs text-ink/50">{activeConv.visitorEmail}</p>}
              </div>
              {activeConv.status !== "closed" && (
                <button onClick={closeConversation} className="text-xs font-semibold text-clay hover:underline">
                  কথোপকথন বন্ধ করুন
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/50">
              {messages.map((m) => (
                <div key={m._id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.sender === "admin"
                        ? "bg-forest text-canvas rounded-br-none"
                        : "bg-white border border-line text-ink rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendReply} className="border-t border-line p-3 flex gap-2 shrink-0">
              <input
                className="input flex-1"
                placeholder="উত্তর লিখুন..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={activeConv.status === "closed"}
              />
              <button type="submit" className="btn-primary !px-4" disabled={activeConv.status === "closed"}>
                পাঠান
              </button>
            </form>
          </>
        )}
      </div>
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
    ["নিশ্চিত দানের পরিমাণ", `${summary.totalDonationAmount.toLocaleString("bn-BD")} টাকা`],
    ["মোট দান সংখ্যা", summary.donationCount],
    ["যাচাই অপেক্ষমান দান", summary.pendingDonations],
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

const emptyNoticeForm = { title: "", body: "", expiresAt: "" };

function NoticesTab() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyNoticeForm);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    api.getAllNotices().then(setNotices).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const notice = await api.createNotice({
        title: form.title,
        body: form.body,
        expiresAt: form.expiresAt || undefined,
      });
      setNotices((prev) => [notice, ...prev]);
      setForm(emptyNoticeForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (n) => {
    try {
      const updated = await api.updateNotice(n._id, { active: !n.active });
      setNotices((prev) => prev.map((x) => (x._id === n._id ? updated : x)));
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("এই নোটিশ মুছে ফেলতে চান?")) return;
    try {
      await api.deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="card space-y-4 mb-8">
        <h3 className="font-semibold text-forest">নতুন নোটিশ যোগ করুন</h3>
        <div>
          <label className="label" htmlFor="notice-title">শিরোনাম *</label>
          <input
            className="input"
            id="notice-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="যেমন: ঈদের ছুটিতে অফিস বন্ধ থাকবে"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="notice-body">বিস্তারিত (ঐচ্ছিক)</label>
          <textarea
            className="input"
            id="notice-body"
            rows={2}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="notice-expiry">মেয়াদ শেষের তারিখ (ঐচ্ছিক)</label>
          <input
            className="input"
            id="notice-expiry"
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
          />
          <p className="text-xs text-ink/50 mt-1">খালি রাখলে নোটিশ ম্যানুয়ালি বন্ধ না করা পর্যন্ত দেখানো হবে।</p>
        </div>
        <button type="submit" className="btn-primary" disabled={creating}>
          {creating ? "যোগ হচ্ছে..." : "নোটিশ প্রকাশ করুন"}
        </button>
      </form>

      {loading && <PageLoading />}
      {error && <p className="text-clay text-sm">{error}</p>}
      {!loading && notices.length === 0 && <p className="text-ink/50">কোনো নোটিশ নেই।</p>}

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n._id} className={`card flex flex-wrap items-start justify-between gap-3 ${!n.active ? "opacity-50" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-forest">{n.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${n.active ? "bg-forest/15 text-forest" : "bg-ink/10 text-ink/50"}`}>
                  {n.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>
              {n.body && <p className="text-sm text-ink/60 mt-1">{n.body}</p>}
              {n.expiresAt && (
                <p className="text-xs text-ink/40 mt-1">
                  মেয়াদ শেষ: {new Date(n.expiresAt).toLocaleDateString("bn-BD")}
                </p>
              )}
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => toggleActive(n)} className="text-xs font-semibold text-forest hover:underline">
                {n.active ? "বন্ধ করুন" : "চালু করুন"}
              </button>
              <button onClick={() => remove(n._id)} className="text-xs font-semibold text-clay hover:underline">
                মুছুন
              </button>
            </div>
          </div>
        ))}
      </div>
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

const donationStatusLabel = {
  pending: "যাচাই অপেক্ষমান",
  confirmed: "টাকা পাওয়া গেছে (Valid)",
  not_received: "টাকা পাওয়া যায়নি",
  cancelled: "বাতিল",
};
const donationStatusStyle = {
  pending: "bg-gold/20 text-gold-dark",
  confirmed: "bg-forest/15 text-forest",
  not_received: "bg-clay/15 text-clay",
  cancelled: "bg-ink/10 text-ink/60",
};
const methodLabel = { bkash: "বিকাশ", nagad: "নগদ" };

function DonationsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null); // { donation } | { notFound: true, trxId }
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getDonations().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const applyStatus = (id, status) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    setCheckResult((r) => (r?.donation?._id === id ? { donation: { ...r.donation, status } } : r));
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateDonationStatus(id, status);
      applyStatus(id, status);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    const trxId = query.trim().toUpperCase();
    if (!trxId) return;
    setChecking(true);
    setCheckResult(null);
    try {
      const donation = await api.checkDonationByTrx(trxId);
      setCheckResult({ donation });
    } catch {
      setCheckResult({ notFound: true, trxId });
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <p className="text-clay text-sm">{error}</p>;

  const visible = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="space-y-8">
      {/* TrxID checker */}
      <div className="card">
        <h3 className="font-semibold text-forest mb-1">TrxID যাচাই করুন</h3>
        <p className="text-xs text-ink/55 mb-4 leading-relaxed">
          আপনার বিকাশ/নগদ অ্যাপ বা SMS-এ প্রাপ্ত TrxID এখানে লিখুন। জমা দেওয়া তথ্যের সাথে পরিমাণ ও
          প্রেরকের নম্বর মিলে গেলে &quot;টাকা পাওয়া গেছে&quot; চাপুন, না মিললে &quot;টাকা পাওয়া যায়নি&quot; চাপুন।
        </p>
        <form onSubmit={handleCheck} className="flex gap-3">
          <input
            className="input uppercase"
            placeholder="TrxID লিখুন"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn-primary whitespace-nowrap" disabled={checking}>
            {checking ? "খোঁজা হচ্ছে..." : "যাচাই"}
          </button>
        </form>

        {checkResult?.notFound && (
          <div className="mt-4 rounded-md bg-clay/10 border border-clay/30 p-4 text-sm text-clay font-medium">
            &quot;{checkResult.trxId}&quot; — এই TrxID দিয়ে কোনো দান জমা পড়েনি। টাকা পাওয়া যায়নি / Invalid।
          </div>
        )}

        {checkResult?.donation && (
          <div className="mt-4 rounded-md bg-white border border-line p-4">
            <DonationDetails d={checkResult.donation} onUpdate={updateStatus} />
          </div>
        )}
      </div>

      {/* List */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-forest">সকল দান ({visible.length})</h3>
          <select className="input !w-auto !py-1.5 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">সব অবস্থা</option>
            {Object.entries(donationStatusLabel).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="text-ink/50">কোনো দান পাওয়া যায়নি।</p>
        ) : (
          <div className="space-y-3">
            {visible.map((d) => (
              <div key={d._id} className="card">
                <DonationDetails d={d} onUpdate={updateStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DonationDetails({ d, onUpdate }) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-semibold text-ink">{d.donorName}</p>
          <p className="text-xs text-ink/50">{d.phone}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${donationStatusStyle[d.status] || "bg-ink/10"}`}>
          {donationStatusLabel[d.status] || d.status}
        </span>
      </div>

      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink/75 mb-4">
        <div><dt className="inline text-ink/50">পরিমাণ: </dt><dd className="inline font-semibold">{d.amount.toLocaleString("bn-BD")} টাকা</dd></div>
        <div><dt className="inline text-ink/50">খাত: </dt><dd className="inline">{d.category}</dd></div>
        <div><dt className="inline text-ink/50">মাধ্যম: </dt><dd className="inline">{methodLabel[d.paymentMethod] || "—"}</dd></div>
        <div><dt className="inline text-ink/50">প্রেরকের নম্বর: </dt><dd className="inline">{d.senderNumber || "—"}</dd></div>
        <div className="sm:col-span-2"><dt className="inline text-ink/50">TrxID: </dt><dd className="inline font-mono font-semibold">{d.trxId || "—"}</dd></div>
        {d.note && <div className="sm:col-span-2"><dt className="inline text-ink/50">মন্তব্য: </dt><dd className="inline">{d.note}</dd></div>}
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onUpdate(d._id, "confirmed")}
          disabled={d.status === "confirmed"}
          className="text-xs font-semibold rounded px-3 py-1.5 bg-forest text-canvas hover:bg-forest-light disabled:opacity-40 transition-colors"
        >
          টাকা পাওয়া গেছে
        </button>
        <button
          onClick={() => onUpdate(d._id, "not_received")}
          disabled={d.status === "not_received"}
          className="text-xs font-semibold rounded px-3 py-1.5 bg-clay text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          টাকা পাওয়া যায়নি
        </button>
        <button
          onClick={() => onUpdate(d._id, "pending")}
          disabled={d.status === "pending"}
          className="text-xs font-semibold rounded px-3 py-1.5 border border-line text-ink/70 hover:bg-ink/5 disabled:opacity-40 transition-colors"
        >
          অপেক্ষমান রাখুন
        </button>
      </div>
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
