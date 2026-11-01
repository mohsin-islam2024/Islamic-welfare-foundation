import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/upload";

const PAGE_SIZE = 24;
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0); // কয় পাতা লোড হয়েছে
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const busy = useRef(false);
  const sentinel = useRef(null);

  const hasMore = page === 0 || items.length < total;

  const loadMore = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const res = await api.getGalleryPage(page + 1, PAGE_SIZE);
      if (Array.isArray(res)) {
        // পুরনো সার্ভার সব ছবি একবারে দিলে
        setItems(res);
        setTotal(res.length);
        setPage(1);
      } else {
        setItems((prev) => {
          const seen = new Set(prev.map((i) => i._id));
          return [...prev, ...res.items.filter((i) => !seen.has(i._id))];
        });
        setTotal(res.total);
        setPage(res.page);
      }
    } catch (e) {
      setError(e.message || "ছবি আনতে সমস্যা হয়েছে।");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, [page]);

  // প্রথম পাতা
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // নিচে নামলে আপনা-আপনি পরের পাতা
  useEffect(() => {
    if (!sentinel.current || typeof IntersectionObserver === "undefined" || page === 0 || !hasMore || error) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) loadMore();
      },
      { rootMargin: "700px" }
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [page, hasMore, error, loadMore]);

  // লাইটবক্সে শেষের কাছাকাছি গেলে আরও ছবি আনা
  useEffect(() => {
    if (lightbox !== null && hasMore && !error && lightbox >= items.length - 3) loadMore();
  }, [lightbox, items.length, hasMore, error, loadMore]);

  // লাইটবক্স খোলা থাকলে পেছনের পেজ স্ক্রল বন্ধ + কীবোর্ড
  useEffect(() => {
    if (lightbox === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, items.length, hasMore]);

  const goPrev = () => setLightbox((i) => (i > 0 ? i - 1 : items.length - 1));
  const goNext = () => setLightbox((i) => (i < items.length - 1 ? i + 1 : hasMore ? i : 0));

  const lb = lightbox !== null ? items[lightbox] : null;
  const firstLoad = page === 0 && loading;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Link to="/" className="text-sm font-semibold text-forest hover:underline">← প্রচ্ছদ</Link>
      <h1 className="mt-4 font-headline text-4xl font-normal leading-[1.3] text-forest md:text-5xl">ফটো গ্যালারি</h1>
      {total > 0 && <p className="mt-3 text-ink/60">আমাদের কার্যক্রমের মোট {bn(total)}টি ছবি</p>}

      {firstLoad && (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-forest/10" />
          ))}
        </div>
      )}

      {!firstLoad && items.length === 0 && !error && <p className="mt-10 text-ink/50">এখনো কোনো ছবি যোগ করা হয়নি।</p>}

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item._id}
            type="button"
            onClick={() => setLightbox(i)}
            aria-label={item.caption || "ছবি বড় করে দেখুন"}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/10"
          >
            <img
              src={optimizeImage(item.imageUrl, 600)}
              alt={item.caption || "গ্যালারির ছবি"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-dark/85 to-transparent px-4 pb-3 pt-10 text-left text-sm leading-6 text-canvas opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-8 text-center text-sm font-medium text-clay">{error}</p>
      )}

      {items.length > 0 && (
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-ink/55">
            {bn(items.length)} / {bn(total)}টি ছবি দেখানো হচ্ছে
          </p>
          {hasMore && (
            <button type="button" className="btn-secondary" onClick={loadMore} disabled={loading}>
              {loading ? "লোড হচ্ছে..." : error ? "আবার চেষ্টা করুন" : "আরও ছবি দেখুন"}
            </button>
          )}
        </div>
      )}

      {/* এই ট্রিগারে পৌঁছালে আপনা-আপনি পরের পাতা আসে */}
      <div ref={sentinel} aria-hidden="true" className="h-px" />

      {lb && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-dark/95 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-canvas">
            {bn(lightbox + 1)} / {bn(total)}
          </span>
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 px-3 text-3xl leading-none text-white"
            aria-label="বন্ধ করুন"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 px-3 text-4xl text-white md:left-6"
            aria-label="আগের ছবি"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 px-3 text-4xl text-white md:right-6"
            aria-label="পরের ছবি"
          >
            ›
          </button>
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={optimizeImage(lb.imageUrl, 1600)}
              alt={lb.caption || "গ্যালারির ছবি"}
              className="mx-auto max-h-[80vh] rounded-lg"
            />
            {lb.caption && <figcaption className="mt-4 text-center text-sm leading-7 text-white/90">{lb.caption}</figcaption>}
          </figure>
        </div>
      )}
    </div>
  );
}
