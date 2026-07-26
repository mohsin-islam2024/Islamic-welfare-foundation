import { useEffect, useState } from "react";
import { api } from "../lib/api";

const DISMISSED_KEY = "alfalah_dismissed_notices";

function getDismissedIds() {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function NoticeBar() {
  const [notices, setNotices] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api
      .getActiveNotices()
      .then((all) => {
        const dismissed = getDismissedIds();
        setNotices(all.filter((n) => !dismissed.includes(n._id)));
      })
      .catch(() => {}); // Fail silently — a missing notice bar shouldn't block the site
  }, []);

  if (notices.length === 0) return null;

  const current = notices[index % notices.length];

  const dismiss = () => {
    const dismissed = getDismissedIds();
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed, current._id]));
    setNotices((prev) => prev.filter((n) => n._id !== current._id));
  };

  return (
    <div className="bg-gold text-ink">
      <div className="max-w-6xl mx-auto px-5 py-2.5 flex items-center gap-3 text-sm">
        <span className="font-semibold shrink-0">📢 {current.title}</span>
        {current.body && <span className="text-ink/80 truncate">{current.body}</span>}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          {notices.length > 1 && (
            <button
              onClick={() => setIndex((i) => (i + 1) % notices.length)}
              className="text-xs font-semibold hover:underline"
            >
              পরবর্তী ({index + 1}/{notices.length})
            </button>
          )}
          <button onClick={dismiss} aria-label="বন্ধ করুন" className="text-ink/70 hover:text-ink">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
