import { Link } from "react-router-dom";
import { StarMark } from "./ornaments";

const explore = [
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/programs", label: "কার্যক্রম" },
  { to: "/constitution", label: "নীতিমালা" },
  { to: "/notice-board", label: "নোটিশ বোর্ড" },
  { to: "/blog", label: "ব্লগ" },
];

const involve = [
  { to: "/donate", label: "দান করুন" },
  { to: "/loan-application", label: "কর্জে হাসানাহর আবেদন" },
  { to: "/contact", label: "যোগাযোগ" },
  { to: "/login", label: "লগইন" },
];

function LinkList({ items }) {
  return (
    <ul className="space-y-3 text-sm">
      {items.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="text-canvas/70 transition-colors hover:text-gold-light">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-forest-dark text-canvas/90">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-light/60 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-islamic-pattern bg-pattern-size opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-14 pt-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="h-11 w-11" />
            <span className="font-headline text-2xl font-normal text-gold-light">আল-ইনফাক ফাউন্ডেশন</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-canvas/65">
            আল্লাহর সন্তুষ্টি অর্জনের উদ্দেশ্যে মানবকল্যাণমূলক কার্যক্রম। কর্জে হাসানাহ, চিকিৎসা ও শিক্ষা সহায়তা,
            এতিম ও বিধবা সহায়তা এবং দুর্যোগকালীন ত্রাণ।
          </p>
          <Link to="/donate" className="btn-gold mt-7 !px-6 !py-2.5 text-sm">
            দান করুন
          </Link>
        </div>

        <div>
          <h4 className="mb-5 font-display text-base font-semibold text-canvas">জানুন</h4>
          <LinkList items={explore} />
        </div>

        <div>
          <h4 className="mb-5 font-display text-base font-semibold text-canvas">যুক্ত হোন</h4>
          <LinkList items={involve} />
        </div>

        <div>
          <h4 className="mb-5 font-display text-base font-semibold text-canvas">ঠিকানা</h4>
          <address className="text-sm not-italic leading-7 text-canvas/65">
            গ্রাম: সোটাহার, ডাকঘর: ধারকি
            <br />
            উপজেলা: জয়পুরহাট সদর
            <br />
            জেলা: জয়পুরহাট
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-canvas/50 sm:flex-row">
          <p>© {new Date().getFullYear()} আল-ইনফাক ফাউন্ডেশন। সর্বস্বত্ব সংরক্ষিত।</p>
          <StarMark className="h-3 w-3 text-gold-light/70" />
        </div>
      </div>
    </footer>
  );
}
