import { Link } from "react-router-dom";
import { Icon, Medallion, HeroOrnament } from "../components/ornaments";
import PrinciplesMarquee from "../components/PrinciplesMarquee";
import GallerySection from "../components/GallerySection";
import BlogSection from "../components/BlogSection";

const programs = [
  { icon: "shield", title: "কর্জে হাসানাহ", desc: "ব্যবসা, শিক্ষা, চিকিৎসা ও জরুরি প্রয়োজনে সম্পূর্ণ সুদমুক্ত ঋণ।", to: "/loan-application", cta: "আবেদন করুন" },
  { icon: "pulse", title: "চিকিৎসা সহায়তা", desc: "অসহায় রোগীদের চিকিৎসা ব্যয় বহনে পাশে থাকা।" },
  { icon: "book", title: "শিক্ষা সহায়তা", desc: "দরিদ্র মেধাবী শিক্ষার্থীদের পড়াশোনা চালিয়ে যাওয়ার সুযোগ।" },
  { icon: "users", title: "এতিম ও বিধবা সহায়তা", desc: "নিয়মিত ভরণপোষণ ও প্রয়োজনীয় সহায়তা প্রদান।" },
  { icon: "lifebuoy", title: "দুর্যোগকালীন ত্রাণ", desc: "বন্যা, ঘূর্ণিঝড় ও অন্যান্য দুর্যোগে জরুরি ত্রাণ কার্যক্রম।" },
  { icon: "gift", title: "যাকাত ও ওয়াকফ ব্যবস্থাপনা", desc: "শরিয়াহ অনুযায়ী স্বচ্ছভাবে যাকাত ও ওয়াকফ পরিচালনা।" },
];

const trust = ["শরিয়াহসম্মত বৈধ উৎস থেকে দান", "পাঁচ সদস্যের ঋণ কমিটি", "ছয় মাসে হিসাব প্রকাশ"];

const loanPoints = [
  "সম্পূর্ণ সুদমুক্ত, কোনো লুকানো চার্জ নেই",
  "কোনো সার্ভিস চার্জ বা অতিরিক্ত অর্থ নেই",
  "প্রয়োজনে কিস্তিতে পরিশোধের সুযোগ",
  "আর্থিক সংকটে মানবিক বিবেচনা",
];

const loanSteps = [
  { title: "নিবন্ধন করে আবেদন করুন", desc: "ঋণের উদ্দেশ্য, প্রয়োজনীয় পরিমাণ ও পরিশোধ পরিকল্পনা জানিয়ে আবেদন জমা দিন।" },
  { title: "কমিটির স্বচ্ছ মূল্যায়ন", desc: "পাঁচ সদস্যের ঋণ কমিটি প্রতিটি আবেদন যাচাই করে সিদ্ধান্ত নেয়।" },
  { title: "অবস্থা দেখুন, কিস্তিতে শোধ করুন", desc: "ড্যাশবোর্ডে আবেদনের অবস্থা ও কমিটির মন্তব্য দেখতে পাবেন।" },
];

const donationCategories = [
  "যাকাত",
  "সদকা",
  "কর্জে হাসানাহ তহবিল",
  "শিক্ষা সহায়তা",
  "চিকিৎসা সহায়তা",
  "দুর্যোগ ত্রাণ",
  "সাধারণ দান",
];

export default function Home() {
  return (
    <div>
      {/* নেভবারের ঠিক নিচে: ডান থেকে বামে */}
      <PrinciplesMarquee position="top" />

      {/* ───────── Hero ───────── */}
      <section className="relative isolate overflow-hidden bg-forest-dark text-canvas">
        <div className="absolute inset-0 -z-20 bg-hero-glow" />
        <div className="absolute inset-0 -z-10 bg-islamic-pattern bg-pattern-size opacity-50 lg:opacity-100 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <HeroOrnament className="absolute -right-56 top-[42%] -z-10 w-[44rem] max-w-none -translate-y-1/2 opacity-[0.12] sm:opacity-20 lg:-right-28 lg:w-[42rem] lg:opacity-100" />

        <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-20 md:pt-32 md:pb-28">
          <p className="rise text-gold-light text-sm font-medium" style={{ animationDelay: "0ms" }}>
            জয়পুরহাট সদর, জয়পুরহাট
          </p>

          <h1
            className="rise mt-5 font-headline font-normal text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1.3] max-w-3xl"
            style={{ animationDelay: "120ms" }}
          >
            আল্লাহর সন্তুষ্টির জন্য,
            <br className="hidden sm:block" /> মানুষের কল্যাণে।
          </h1>

          <p className="rise mt-7 max-w-xl text-lg leading-8 text-canvas/75" style={{ animationDelay: "260ms" }}>
            আল-ইনফাক ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী ইসলামিক মানবকল্যাণমূলক সংস্থা।
            সুদমুক্ত ঋণ, চিকিৎসা ও শিক্ষা সহায়তা, এতিম-বিধবা সহায়তা এবং দুর্যোগকালীন ত্রাণের মাধ্যমে
            মানুষের পাশে দাঁড়ানোই আমাদের লক্ষ্য।
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4" style={{ animationDelay: "400ms" }}>
            <Link to="/donate" className="btn-gold w-full sm:w-auto">দান করুন</Link>
            <Link to="/loan-application" className="btn-light w-full sm:w-auto">কর্জে হাসানাহর জন্য আবেদন</Link>
          </div>

          <ul className="rise mt-12 flex flex-col gap-3 pr-16 text-sm text-canvas/75 sm:mt-14 sm:flex-row sm:flex-wrap sm:gap-x-9 sm:pr-0" style={{ animationDelay: "540ms" }}>
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-gold-light" strokeWidth={2.2} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* হিরোর নিচে: বাম থেকে ডানে */}
        <PrinciplesMarquee reverse />
      </section>

      {/* ───────── গ্যালারি ───────── */}
      <GallerySection />

      {/* ───────── কার্যক্রম ───────── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-20">
          <div className="lg:sticky lg:top-28 self-start">
            <h2 className="font-headline font-normal text-4xl md:text-5xl text-forest leading-[1.3]">
              যেভাবে আমরা মানুষের পাশে দাঁড়াই
            </h2>
            <p className="mt-6 text-ink/65 leading-8 max-w-md">
              প্রতিটি খাতে সহায়তা পৌঁছানোর আগে আমরা প্রকৃত প্রয়োজন যাচাই করি, যাতে আপনার দান ঠিক
              জায়গায় পৌঁছায়।
            </p>
            <Link to="/programs" className="btn-secondary mt-9">সকল কার্যক্রম দেখুন</Link>
          </div>

          <ul>
            {programs.map((p) => (
              <li key={p.title} className="flex gap-5 py-7 border-t border-line last:border-b">
                <Medallion icon={p.icon} />
                <div>
                  <h3 className="font-display font-semibold text-xl text-forest">{p.title}</h3>
                  <p className="mt-1.5 text-ink/65 leading-7">{p.desc}</p>
                  {p.to && (
                    <Link to={p.to} className="mt-3 inline-block text-sm font-semibold text-gold-dark hover:underline">
                      {p.cta}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── কর্জে হাসানাহ ───────── */}
      <section className="px-5">
        <div className="relative isolate max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-forest text-canvas shadow-panel">
          <div className="absolute inset-0 -z-10 bg-islamic-pattern bg-pattern-size opacity-70 [mask-image:linear-gradient(120deg,black,transparent_60%)] [-webkit-mask-image:linear-gradient(120deg,black,transparent_60%)]" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 p-8 md:p-14">
            <div>
              <h2 className="font-headline font-normal text-4xl md:text-5xl leading-[1.3]">
                সুদমুক্ত ঋণ, সম্মানের সাথে
              </h2>
              <p className="mt-6 text-canvas/75 leading-8 max-w-md">
                ব্যবসা, শিক্ষা, চিকিৎসা, কৃষিকাজ বা জরুরি পারিবারিক প্রয়োজনে আমরা সম্পূর্ণ সুদমুক্ত
                ঋণ প্রদান করি। শুধু আল্লাহর সন্তুষ্টির জন্য।
              </p>

              <ul className="mt-8 space-y-3">
                {loanPoints.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-canvas/90">
                    <Icon name="check" className="w-5 h-5 mt-1 shrink-0 text-gold-light" strokeWidth={2.2} />
                    {t}
                  </li>
                ))}
              </ul>

              <Link to="/loan-application" className="btn-gold mt-10">আবেদন করুন</Link>
            </div>

            <ol className="relative self-center">
              <span className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-gradient-to-b from-gold-light/60 via-gold-light/30 to-transparent" aria-hidden="true" />
              {loanSteps.map((s, i) => (
                <li key={s.title} className="relative flex gap-5 pb-9 last:pb-0">
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-light/60 bg-forest-dark font-display font-semibold text-gold-light">
                    {["১", "২", "৩"][i]}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                    <p className="mt-1.5 text-canvas/70 leading-7">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── ব্লগ ───────── */}
      <BlogSection />

      {/* ───────── দান ───────── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-8 md:p-14">
          <div>
            <h2 className="font-headline font-normal text-4xl md:text-5xl text-forest leading-[1.3]">
              আপনার সহায়তা বদলে দিতে পারে একটি জীবন
            </h2>
            <p className="mt-6 text-ink/70 leading-8 max-w-lg">
              বিকাশ বা নগদে সরাসরি Send Money করে TrxID জমা দিন। আমরা যাচাই করে দান নিশ্চিত করি এবং
              প্রকৃত প্রয়োজনে পৌঁছে দিই।
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/donate" className="btn-primary">এখনই দান করুন</Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/80">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E2136E" }} /> বিকাশ
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/80">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#F6921E" }} /> নগদ
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-forest mb-4">যেসব খাতে দান করা যায়</p>
            <div className="flex flex-wrap gap-2.5">
              {donationCategories.map((c) => (
                <span key={c} className="rounded-full border border-forest/20 bg-white/70 px-4 py-2 text-sm text-forest">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}