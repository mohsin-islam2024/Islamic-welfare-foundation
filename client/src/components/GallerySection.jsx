import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/upload";

const INITIAL_COUNT = 8;

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null); // index in visible list

  useEffect(() => {
    api.getGallery().then(setItems).catch(() => {});
  }, []);

  const visible = showAll ? items : items.slice(0, INITIAL_COUNT);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(
    () => setSelected((i) => (i === null ? i : (i - 1 + visible.length) % visible.length)),
    [visible.length]
  );
  const next = useCallback(
    () => setSelected((i) => (i === null ? i : (i + 1) % visible.length)),
    [visible.length]
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close, prev, next]);

  if (items.length === 0) return null;

  const current = selected !== null ? visible[selected] : null;

  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <p className="eyebrow mb-3">ফটো গ্যালারি</p>
      <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-10">আমাদের কার্যক্রমের কিছু মুহূর্ত</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visible.map((item, i) => (
          <button
            key={item._id}
            type="button"
            onClick={() => setSelected(i)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-white"
            aria-label={item.caption || "ছবি বড় করে দেখুন"}
          >
            <img
              src={optimizeImage(item.imageUrl, 500)}
              alt={item.caption || "গ্যালারির ছবি"}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {items.length > INITIAL_COUNT && (
        <div className="mt-8 text-center">
          <button type="button" className="btn-secondary" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "কম দেখুন" : `সব ছবি দেখুন (${items.length})`}
          </button>
        </div>
      )}

      {current && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white text-3xl leading-none px-3"
            aria-label="বন্ধ করুন"
          >
            ×
          </button>
          {visible.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 md:left-6 text-white text-4xl px-3"
                aria-label="আগের ছবি"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 md:right-6 text-white text-4xl px-3"
                aria-label="পরের ছবি"
              >
                ›
              </button>
            </>
          )}
          <figure className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={optimizeImage(current.imageUrl, 1600)}
              alt={current.caption || "গ্যালারির ছবি"}
              className="max-h-[80vh] mx-auto rounded"
            />
            {current.caption && (
              <figcaption className="text-center text-white/90 text-sm mt-3">{current.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
