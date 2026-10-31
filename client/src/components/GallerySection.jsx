import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/upload";

const INTERVAL = 5500; // প্রতিটি ছবি কত মিলিসেকেন্ড থাকবে
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [lightbox, setLightbox] = useState(null); // items-এর index
  const [reduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const sliderRef = useRef(null);
  const thumbsRef = useRef(null);
  const startX = useRef(null);
  const moved = useRef(false);

  const n = items.length;

  useEffect(() => {
    api.getGallery().then(setItems).catch(() => {});
  }, []);

  const next = useCallback(() => setIndex((i) => (n ? (i + 1) % n : 0)), [n]);
  const prev = useCallback(() => setIndex((i) => (n ? (i - 1 + n) % n : 0)), [n]);

  // স্ক্রিনের বাইরে গেলে স্লাইড থামে
  useEffect(() => {
    if (!n || !sliderRef.current || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(sliderRef.current);
    return () => io.disconnect();
  }, [n]);

  // ট্যাব লুকানো থাকলে থামে
  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // সক্রিয় থাম্বনেইল স্ট্রিপের মাঝে আনা (শুধু স্ট্রিপের ভেতরে স্ক্রল, পুরো পেজ নয়)
  useEffect(() => {
    const box = thumbsRef.current;
    const el = box?.children[index];
    if (!box || !el) return;
    const left = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2;
    if (typeof box.scrollTo === "function") box.scrollTo({ left, behavior: "smooth" });
    else box.scrollLeft = left;
  }, [index]);

  // লাইটবক্সের কীবোর্ড
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + n) % n);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, n]);

  const closeLightbox = () => {
    if (lightbox !== null) setIndex(lightbox); // লাইটবক্সে যে ছবিতে ছিলেন স্লাইডার সেখানেই ফিরবে
    setLightbox(null);
  };

  if (n === 0) return null;

  const playing = n > 1 && !reduced && !hovered && inView && tabVisible && lightbox === null;

  // সোয়াইপ
  const onPointerDown = (e) => {
    startX.current = e.clientX;
    moved.current = false;
  };
  const onPointerUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) {
      moved.current = true;
      if (dx < 0) next();
      else prev();
    }
  };
  const onOpen = () => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    setLightbox(index);
  };

  const current = items[index];
  const lb = lightbox !== null ? items[lightbox] : null;

  return (
    <section className="max-w-6xl mx-auto px-5 pt-24">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-headline font-normal text-4xl md:text-5xl text-forest leading-[1.3]">
          আমাদের কার্যক্রমের কিছু মুহূর্ত
        </h2>
      </div>

      {/* ───── স্লাইডার ───── */}
      <div
        ref={sliderRef}
        className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[1.75rem] bg-forest-dark shadow-panel sm:aspect-[16/9] lg:aspect-[2/1]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {items.map((item, i) => {
          const d = Math.abs(i - index);
          if (Math.min(d, n - d) > 1) return null; // শুধু বর্তমান ও আশপাশের ছবি লোড হয়
          const active = i === index;
          return (
            <div
              key={item._id}
              className="absolute inset-0"
              style={{ opacity: active ? 1 : 0, transition: "opacity 900ms ease" }}
              aria-hidden={!active}
            >
              {/* পেছনে একই ছবির ঝাপসা সংস্করণ, যাতে সামনের ছবি না কেটে পুরোটা দেখানো যায় */}
              <img
                src={optimizeImage(item.imageUrl, 300)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl"
              />
              <img
                src={optimizeImage(item.imageUrl, 1400)}
                alt={item.caption || "গ্যালারির ছবি"}
                className="relative h-full w-full object-contain"
                style={{
                  transform: active && !reduced ? "scale(1.03)" : "scale(1)",
                  transition: "transform 7000ms ease-out",
                }}
              />
            </div>
          );
        })}

        {/* ক্লিক = বড় করে দেখা; সোয়াইপ = পরের/আগের ছবি */}
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label="ছবি বড় করে দেখুন"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startX.current = null)}
          onClick={onOpen}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-forest-dark/85 via-forest-dark/30 to-transparent" />

        {current?.caption && (
          <p
            key={current._id}
            className="rise pointer-events-none absolute bottom-6 left-5 right-5 z-20 max-w-2xl font-display text-lg leading-8 text-canvas sm:bottom-8 sm:left-8 md:text-xl"
          >
            {current.caption}
          </p>
        )}

        {n > 1 && (
          <>
            <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-canvas backdrop-blur-md">
              {bn(index + 1)} / {bn(n)}
            </span>

            <button
              type="button"
              onClick={prev}
              aria-label="আগের ছবি"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-canvas backdrop-blur-md transition-colors hover:bg-white/25 sm:left-5 sm:h-12 sm:w-12"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="পরের ছবি"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-canvas backdrop-blur-md transition-colors hover:bg-white/25 sm:right-5 sm:h-12 sm:w-12"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            {/* অটো-স্লাইডের অগ্রগতি বার: অ্যানিমেশন শেষ হলেই পরের ছবি */}
            {!reduced && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/15">
                <span
                  key={index}
                  className="slide-progress block h-full w-full bg-gold-light"
                  style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: playing ? "running" : "paused" }}
                  onAnimationEnd={next}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* ───── থাম্বনেইল ───── */}
      {n > 1 && (
        <div ref={thumbsRef} className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {items.map((item, i) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`ছবি ${bn(i + 1)}`}
              aria-current={i === index}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 sm:h-[4.5rem] sm:w-28 ${
                i === index ? "border-gold opacity-100" : "border-transparent opacity-55 hover:opacity-100"
              }`}
            >
              <img src={optimizeImage(item.imageUrl, 240)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ───── লাইটবক্স ───── */}
      {lb && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-dark/95 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 px-3 text-3xl leading-none text-white"
            aria-label="বন্ধ করুন"
          >
            ×
          </button>
          {n > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + n) % n); }}
                className="absolute left-3 px-3 text-4xl text-white md:left-6"
                aria-label="আগের ছবি"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % n); }}
                className="absolute right-3 px-3 text-4xl text-white md:right-6"
                aria-label="পরের ছবি"
              >
                ›
              </button>
            </>
          )}
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
    </section>
  );
}
