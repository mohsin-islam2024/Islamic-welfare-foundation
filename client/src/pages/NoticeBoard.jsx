import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PageLoading } from "../components/RouteGuards";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getActiveNotices()
      .then(setNotices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">নোটিশ বোর্ড</p>
      <h1 className="text-4xl font-semibold text-forest mb-4">সকল নোটিশ ও ঘোষণা</h1>
      <p className="text-ink/65 mb-10 leading-relaxed">
        ফাউন্ডেশনের সাম্প্রতিক ঘোষণা, সভার সময়সূচি ও গুরুত্বপূর্ণ তথ্য এখানে প্রকাশ করা হয়।
      </p>

      {loading && <PageLoading />}
      {error && <p className="text-clay text-sm">{error}</p>}

      {!loading && !error && notices.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-ink/60">এই মুহূর্তে কোনো নোটিশ নেই।</p>
        </div>
      )}

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n._id} className="card border-l-4 border-l-gold">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-display font-semibold text-lg text-forest">{n.title}</h2>
              <span className="text-xs text-ink/45 shrink-0">
                {new Date(n.createdAt).toLocaleDateString("bn-BD", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            {n.body && <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line">{n.body}</p>}
            {n.expiresAt && (
              <p className="text-xs text-ink/40 mt-3 pt-3 border-t border-line">
                কার্যকর থাকবে: {new Date(n.expiresAt).toLocaleDateString("bn-BD")} পর্যন্ত
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
