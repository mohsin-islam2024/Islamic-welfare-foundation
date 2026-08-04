import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const DISMISSED_KEY = "alinfaq_dismissed_notices";

function getDismissedIds() {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function NoticeBar() {
  const [notices, setNotices] = useState([]);
  const [dismissedAll, setDismissedAll] = useState(false);

  useEffect(() => {
    api
      .getActiveNotices()
      .then((all) => {
        const dismissed = getDismissedIds();
        setNotices(all.filter((n) => !dismissed.includes(n._id)));
      })
      .catch(() => {}); // Fail silently — a missing notice bar shouldn't block the site
  }, []);

  if (notices.length === 0 || dismissedAll) return null;

  // Dismissing marks every currently-shown notice as seen, then hides the whole bar.
  const dismissAll = () => {
    const dismissed = getDismissedIds();
    const ids = notices.map((n) => n._id);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed, ...ids]));
    setDismissedAll(true);
  };

  const combinedText = notices
    .map((n) => (n.body ? `${n.title} — ${n.body}` : n.title))
    .join("   ৷   ");

  // Longer text needs more time to scroll past so it stays readable —
  // roughly 3.5 characters per second, with sensible floor/ceiling.
  const duration = Math.min(90, Math.max(28, combinedText.length / 3.5));

  return (
    <div className="bg-gold text-ink overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <span className="shrink-0 pl-5 py-2.5 text-base leading-none">📢</span>
        <div className="flex-1 min-w-0 overflow-hidden py-2.5">
          <div
            className="whitespace-nowrap inline-block animate-notice-marquee font-medium text-sm"
            style={{ animationDuration: `${duration}s` }}
          >
            {combinedText}
          </div>
        </div>
        <Link
          to="/notice-board"
          className="shrink-0 text-xs font-semibold underline decoration-ink/40 hover:decoration-ink whitespace-nowrap"
        >
          সব দেখুন
        </Link>
        <button
          onClick={dismissAll}
          aria-label="নোটিশ বন্ধ করুন"
          className="shrink-0 pr-5 py-2.5 text-ink/70 hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
