import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/upload";

const INITIAL_COUNT = 8;

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);

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
    <section className="max-w-6xl mx-auto px-5 pt-24">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-headline font-normal text-4xl md:text-5xl text-forest leading-[1.3]">
          আমাদের কার্যক্রমের কিছু মুহূর্ত
        </h2>
      </div>

      {/* প্রথম ছবি মিহরাব-ধাঁচের খিলানে, বড় আকারে; বাকিগুলো সমান ঘরে */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9.5rem] md:auto-rows-[13rem] gap-3 md:gap-4">
        {visible.map((item, i) => (
          <button
            key={item._id}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={item.caption || "ছবি বড় করে দেখুন"}
            className={`group relative overflow-hidden bg-forest/10 ${
              i === 0 ? "col-span-2 row-span-2 rounded-t-[999px] rounded-b-2xl" : "rounded-2xl"
            }`}
          >
            <img
              src={optimizeImage(item.imageUrl, i === 0 ? 1000 : 600)}
              alt={item.caption || "গ্যালারির ছবি"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-dark/85 to-transparent px-4 pb-4 pt-12 text-left text-sm leading-6 text-canvas opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {items.length > INITIAL_COUNT && (
        <div className="mt-10 text-center">
          <button type="button" className="btn-secondary" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "কম দেখুন" : `সব ছবি দেখুন (${items.length})`}
          </button>
        </div>
      )}

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-dark/95 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 px-3 text-3xl leading-none text-white"
            aria-label="বন্ধ করুন"
          >
            ×
          </button>
          {visible.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 px-3 text-4xl text-white md:left-6"
                aria-label="আগের ছবি"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 px-3 text-4xl text-white md:right-6"
                aria-label="পরের ছবি"
              >
                ›
              </button>
            </>
          )}
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={optimizeImage(current.imageUrl, 1600)}
              alt={current.caption || "গ্যালারির ছবি"}
              className="mx-auto max-h-[80vh] rounded-lg"
            />
            {current.caption && (
              <figcaption className="mt-4 text-center text-sm leading-7 text-white/90">{current.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
