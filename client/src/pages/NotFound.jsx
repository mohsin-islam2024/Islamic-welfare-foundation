import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-32 text-center">
      <p className="font-display text-6xl text-gold/60 font-semibold mb-4">৪০৪</p>
      <h1 className="text-2xl font-semibold text-forest mb-3">পাতাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="text-ink/60 mb-8">আপনি যে পাতাটি খুঁজছেন তা হয়তো সরানো হয়েছে বা বিদ্যমান নেই।</p>
      <Link to="/" className="btn-primary">প্রচ্ছদে ফিরে যান</Link>
    </div>
  );
}
