import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * লিংকে ক্লিক করে নতুন পেজে গেলে পেজ আপনা-আপনি একদম উপরে যায়।
 * - ব্যাক/ফরওয়ার্ড বাটনে (POP) হাত দেয় না, ব্রাউজার আগের জায়গাতেই ফেরায়।
 * - #আইডি লিংক থাকলে সেই অংশে যায়।
 * - একই পেজের লিংকে আবার ক্লিক করলেও উপরে যায় (location.key প্রতিবার নতুন হয়)।
 */
export default function ScrollToTop() {
  const { key, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === "POP") return;

    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* যেমন আছে তেমন */ }
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    // CSS-এ scroll-behavior: smooth থাকলেও এখানে সরাসরি উপরে যাবে (ফুটার থেকে ধীরে ধীরে নয়)
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
