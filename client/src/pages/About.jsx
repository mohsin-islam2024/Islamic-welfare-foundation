const principles = [
  ["আল্লাহভীতি", "প্রতিটি সিদ্ধান্তে আল্লাহর সন্তুষ্টিকে প্রাধান্য দেওয়া।"],
  ["সততা", "প্রতিটি লেনদেন ও সিদ্ধান্তে সততা বজায় রাখা।"],
  ["আমানতদারিতা", "দাতা ও সুবিধাভোগীদের আস্থাকে আমানত হিসেবে রক্ষা করা।"],
  ["স্বচ্ছতা", "আর্থিক হিসাব ও কার্যক্রম নিয়মিত প্রকাশ করা।"],
  ["জবাবদিহিতা", "প্রতিটি সিদ্ধান্তের জন্য দায়বদ্ধ থাকা।"],
  ["ন্যায়বিচার", "কোনো পক্ষপাতিত্ব ছাড়া ন্যায্য সিদ্ধান্ত গ্রহণ।"],
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">আমাদের সম্পর্কে</p>
      <h1 className="text-4xl font-semibold text-forest mb-6">আল-ইনফাক ফাউন্ডেশন</h1>
      <p className="text-ink/70 leading-relaxed text-lg mb-10">
        আল-ইনফাক ফাউন্ডেশন একটি ইসলামিক সামাজিক কল্যাণ সংস্থা, যার প্রধান লক্ষ্য আল্লাহর সন্তুষ্টি
        অর্জনের উদ্দেশ্যে মানবকল্যাণমূলক কার্যক্রম পরিচালনা করা। দলীয় রাজনীতি থেকে সম্পূর্ণ নিরপেক্ষ থেকে
        আমরা দরিদ্র ও অসহায় মানুষের পাশে দাঁড়াই।
      </p>

      <div className="card mb-10">
        <h2 className="font-display font-semibold text-xl text-forest mb-3">ঠিকানা</h2>
        <p className="text-ink/70 leading-relaxed">
          গ্রাম: সোটাহার, ডাকঘর: ধারকি
          <br />
          উপজেলা: জয়পুরহাট সদর, জেলা: জয়পুরহাট
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-ink mb-6">আমাদের মূলনীতি</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {principles.map(([title, desc]) => (
          <div key={title} className="border-l-2 border-gold pl-4 py-1">
            <h3 className="font-semibold text-forest">{title}</h3>
            <p className="text-sm text-ink/60 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="card bg-forest/5 border-forest/20">
        <h2 className="font-display font-semibold text-xl text-forest mb-3">আর্থিক স্বচ্ছতা</h2>
        <p className="text-ink/70 leading-relaxed text-sm">
          সংস্থার প্রতিটি আয়-ব্যয়ের রসিদ সংরক্ষণ করা হয় এবং প্রতি ছয় মাসে হিসাব প্রকাশ করা হয়। কোনো
          সদস্য সংস্থার অর্থ ব্যক্তিগত কাজে ব্যবহার করতে পারবেন না। সংস্থা বিলুপ্ত হলে অবশিষ্ট সম্পদ
          একই ধরনের অন্য কোনো নিবন্ধিত দাতব্য প্রতিষ্ঠানে হস্তান্তর করা হবে — কোনো সদস্যের মধ্যে বণ্টন
          করা হবে না।
        </p>
      </div>
    </div>
  );
}
