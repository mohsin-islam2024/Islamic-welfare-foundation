import { Link } from "react-router-dom";

const pillars = [
  { title: "কর্জে হাসানাহ", desc: "ব্যবসা, শিক্ষা, চিকিৎসা ও জরুরি প্রয়োজনে সম্পূর্ণ সুদমুক্ত ঋণ।" },
  { title: "চিকিৎসা সহায়তা", desc: "অসহায় রোগীদের চিকিৎসা ব্যয় বহনে পাশে থাকা।" },
  { title: "শিক্ষা সহায়তা", desc: "দরিদ্র মেধাবী শিক্ষার্থীদের পড়াশোনা চালিয়ে যাওয়ার সুযোগ।" },
  { title: "এতিম ও বিধবা সহায়তা", desc: "নিয়মিত ভরণপোষণ ও প্রয়োজনীয় সহায়তা প্রদান।" },
  { title: "দুর্যোগকালীন ত্রাণ", desc: "বন্যা, ঘূর্ণিঝড় ও অন্যান্য দুর্যোগে জরুরি ত্রাণ কার্যক্রম।" },
  { title: "যাকাত ও ওয়াকফ ব্যবস্থাপনা", desc: "শরিয়াহ অনুযায়ী স্বচ্ছভাবে যাকাত ও ওয়াকফ পরিচালনা।" },
];

const principles = ["আল্লাহভীতি", "সততা", "আমানতদারিতা", "স্বচ্ছতা", "জবাবদিহিতা", "ন্যায়বিচার"];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-lattice bg-lattice-size opacity-40 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28 relative">
          <p className="eyebrow mb-4">প্রতিষ্ঠিত জয়পুরহাট সদর, জয়পুরহাট</p>
          <h1 className="text-4xl md:text-6xl font-semibold text-forest max-w-3xl leading-[1.15]">
            আল্লাহর সন্তুষ্টির জন্য, মানুষের কল্যাণে।
          </h1>
          <p className="mt-6 max-w-xl text-ink/70 text-lg leading-relaxed">
            আল-ইনফাক ফাউন্ডেশন একটি ইসলামিক সামাজিক কল্যাণ সংস্থা — সুদমুক্ত ঋণ, চিকিৎসা ও শিক্ষা
            সহায়তা, এতিম-বিধবা সহায়তা এবং দুর্যোগকালীন ত্রাণের মাধ্যমে মানুষের পাশে দাঁড়ানোই আমাদের লক্ষ্য।
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/donate" className="btn-primary">
              দান করুন
            </Link>
            <Link to="/loan-application" className="btn-secondary">
              কর্জে হাসানাহর জন্য আবেদন করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Principles strip */}
      <section className="bg-forest text-canvas">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {principles.map((p, i) => (
            <span key={p} className="text-sm font-medium flex items-center gap-2">
              {i !== 0 && <span className="w-1 h-1 rounded-full bg-gold-light hidden md:inline-block -ml-4 mr-4" />}
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <p className="eyebrow mb-3">আমাদের কার্যক্রম</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-12 max-w-2xl">
          যেভাবে আমরা মানুষের পাশে দাঁড়াই
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div key={p.title} className="card hover:border-gold/60 hover:shadow-sm transition-all">
              <h3 className="font-display font-semibold text-lg text-forest mb-2">{p.title}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/programs" className="text-forest font-semibold hover:underline">
            সকল কার্যক্রম বিস্তারিত দেখুন →
          </Link>
        </div>
      </section>

      {/* Qard Hasan callout */}
      <section className="bg-gold/10 border-y border-gold/20">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-3">কর্জে হাসানাহ</p>
            <h2 className="text-3xl font-semibold text-ink mb-4">সুদমুক্ত ঋণ, সম্মানের সাথে</h2>
            <p className="text-ink/70 leading-relaxed mb-6">
              ব্যবসা, শিক্ষা, চিকিৎসা, কৃষিকাজ বা জরুরি পারিবারিক প্রয়োজনে আমরা সম্পূর্ণ সুদমুক্ত ঋণ
              প্রদান করি। কোনো সার্ভিস চার্জ নেই, কোনো অতিরিক্ত অর্থ নেই — শুধু আল্লাহর সন্তুষ্টির
              জন্য।
            </p>
            <Link to="/loan-application" className="btn-primary">
              আবেদন করুন
            </Link>
          </div>
          <div className="card bg-white">
            <ul className="space-y-3 text-sm text-ink/75">
              <li className="flex gap-2"><span className="text-gold-dark font-bold">✓</span> সম্পূর্ণ সুদমুক্ত, কোনো লুকানো চার্জ নেই</li>
              <li className="flex gap-2"><span className="text-gold-dark font-bold">✓</span> পাঁচ সদস্যের ঋণ কমিটির স্বচ্ছ মূল্যায়ন</li>
              <li className="flex gap-2"><span className="text-gold-dark font-bold">✓</span> প্রয়োজনে কিস্তিতে পরিশোধের সুযোগ</li>
              <li className="flex gap-2"><span className="text-gold-dark font-bold">✓</span> আর্থিক সংকটে মানবিক বিবেচনা</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-forest mb-4">
          আপনার সহায়তা বদলে দিতে পারে একটি জীবন
        </h2>
        <p className="text-ink/70 max-w-xl mx-auto mb-8">
          যাকাত, সদকা বা সাধারণ দান — যেভাবেই আপনি এগিয়ে আসুন, তা পৌঁছে যাবে প্রকৃত প্রয়োজনের কাছে।
        </p>
        <Link to="/donate" className="btn-primary">
          এখনই দান করুন
        </Link>
      </section>
    </div>
  );
}
