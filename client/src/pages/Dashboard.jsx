import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { PageLoading } from "../components/RouteGuards";

const statusColors = {
  "জমা হয়েছে": "bg-ink/10 text-ink/70",
  "পর্যালোচনাধীন": "bg-gold/20 text-gold-dark",
  "অনুমোদিত": "bg-forest/15 text-forest",
  "প্রত্যাখ্যাত": "bg-clay/15 text-clay",
  "পরিশোধিত": "bg-forest/25 text-forest-dark",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMyLoanApplications()
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">ড্যাশবোর্ড</p>
      <h1 className="text-3xl font-semibold text-forest mb-2">
        স্বাগতম, {user.displayName || user.email}
      </h1>
      <p className="text-ink/60 mb-10">আপনার কর্জে হাসানাহ আবেদনসমূহের অবস্থা এখানে দেখুন।</p>

      {loading && <PageLoading />}
      {error && <p className="text-clay text-sm">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-ink/60 mb-5">আপনি এখনো কোনো ঋণের আবেদন করেননি।</p>
          <Link to="/loan-application" className="btn-primary">কর্জে হাসানাহর জন্য আবেদন করুন</Link>
        </div>
      )}

      <div className="space-y-4">
        {applications.map((a) => (
          <div key={a._id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-semibold text-forest">{a.purpose}</h3>
                <p className="text-xs text-ink/50">
                  আবেদনের তারিখ: {new Date(a.createdAt).toLocaleDateString("bn-BD")}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[a.status] || "bg-ink/10"}`}>
                {a.status}
              </span>
            </div>
            <p className="text-sm text-ink/70">প্রয়োজনীয় পরিমাণ: {a.requestedAmount.toLocaleString("bn-BD")} টাকা</p>
            {a.committeeNotes && (
              <p className="text-sm text-ink/60 mt-2 border-t border-line pt-2">
                কমিটির মন্তব্য: {a.committeeNotes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
