import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-canvas/90 mt-20">
      <div className="max-w-6xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-gold-light mb-3">আল-ফালাহ ফাউন্ডেশন</h3>
          <p className="text-sm leading-relaxed text-canvas/70">
            আল্লাহর সন্তুষ্টি অর্জনের উদ্দেশ্যে মানবকল্যাণমূলক কার্যক্রম — কর্জে হাসানাহ, চিকিৎসা ও
            শিক্ষা সহায়তা, এতিম ও বিধবা সহায়তা এবং দুর্যোগকালীন ত্রাণ।
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gold-light mb-3 tracking-wide">ঠিকানা</h4>
          <p className="text-sm text-canvas/70 leading-relaxed">
            গ্রাম: সোটাহার, ডাকঘর: ধারকি
            <br />
            উপজেলা: জয়পুরহাট সদর
            <br />
            জেলা: জয়পুরহাট
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gold-light mb-3 tracking-wide">লিংক</h4>
          <ul className="space-y-2 text-sm text-canvas/70">
            <li><Link to="/about" className="hover:text-gold-light">আমাদের সম্পর্কে</Link></li>
            <li><Link to="/programs" className="hover:text-gold-light">কার্যক্রম</Link></li>
            <li><Link to="/donate" className="hover:text-gold-light">দান করুন</Link></li>
            <li><Link to="/contact" className="hover:text-gold-light">যোগাযোগ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-canvas/10 py-5 text-center text-xs text-canvas/50">
        © {new Date().getFullYear()} আল-ফালাহ ফাউন্ডেশন। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
