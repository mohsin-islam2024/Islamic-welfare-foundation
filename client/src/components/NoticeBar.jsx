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

  return (
    <div className="bg-gold text-ink overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <span className="shrink-0 pl-5 py-2.5 text-base leading-none">📢</span>
        <div className="flex-1 min-w-0 overflow-hidden py-2.5">
          <div className="whitespace-nowrap inline-block animate-notice-marquee font-medium text-sm">
            {combinedText}
          </div>
        </div>
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
