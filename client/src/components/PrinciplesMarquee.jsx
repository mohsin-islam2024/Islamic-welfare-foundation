import { StarMark } from "./ornaments";

const principles = ["আল্লাহভীতি", "সততা", "আমানতদারিতা", "স্বচ্ছতা", "জবাবদিহিতা", "ন্যায়বিচার"];

/**
 * মূলনীতির ধীর গতির মার্কি।
 * reverse=false → ডান থেকে বামে (নিচের স্ট্রিপ)
 * reverse=true  → বাম থেকে ডানে (উপরের স্ট্রিপ)
 * position="top" হলে নিজের গাঢ় ব্যাকগ্রাউন্ড ও নিচের বর্ডার নেয়; "bottom" হলে হিরোর ভেতরে বসে।
 */
export default function PrinciplesMarquee({ reverse = false, position = "bottom" }) {
  const strip = (
    <div
      className={`marquee relative bg-black/20 py-6 md:py-7 ${reverse ? "marquee-reverse" : ""} ${
        position === "top" ? "border-b border-gold-light/20" : "border-t border-gold-light/20"
      }`}
      aria-label="আমাদের মূলনীতি"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((g) => (
            <ul
              key={g}
              className={`flex shrink-0 items-center ${g === 1 ? "marquee-dup" : ""}`}
              aria-hidden={g === 1 ? "true" : undefined}
            >
              {[...principles, ...principles].map((p, i) => (
                <li key={`${g}-${i}`} className="flex items-center">
                  <span className="whitespace-nowrap px-7 font-headline text-xl text-canvas/90 md:px-10 md:text-2xl">
                    {p}
                  </span>
                  <StarMark className="h-3 w-3 shrink-0 text-gold-light md:h-3.5 md:w-3.5" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );

  // উপরের স্ট্রিপের নিচে হিরোর ব্যাকগ্রাউন্ডের সাথে মিলিয়ে একই গাঢ় রঙ
  return position === "top" ? <div className="bg-forest-dark">{strip}</div> : strip;
}
