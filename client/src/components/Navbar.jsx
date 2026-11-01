import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ডেস্কটপে জায়গা বাঁচাতে "ব্লগ" শুধু মোবাইল মেনু ও ফুটারে; "দান করুন" আলাদা বাটন হিসেবে
const desktopLinks = [
  { to: "/", label: "প্রচ্ছদ" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/programs", label: "কার্যক্রম" },
  { to: "/constitution", label: "নীতিমালা" },
  { to: "/notice-board", label: "নোটিশ বোর্ড" },
  { to: "/loan-application", label: "কর্জে হাসানাহ" },
  { to: "/contact", label: "যোগাযোগ" },
];

const mobileLinks = [
  { to: "/", label: "প্রচ্ছদ" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/programs", label: "কার্যক্রম" },
  { to: "/constitution", label: "নীতিমালা" },
  { to: "/notice-board", label: "নোটিশ বোর্ড" },
  { to: "/gallery", label: "গ্যালারি" },
  { to: "/blog", label: "ব্লগ" },
  { to: "/loan-application", label: "কর্জে হাসানাহ" },
  { to: "/contact", label: "যোগাযোগ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // পেজ বদলালে মোবাইল মেনু বন্ধ
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${
        scrolled ? "bg-canvas/95 shadow-[0_10px_30px_-20px_rgba(10,34,25,0.55)]" : "bg-canvas/80"
      }`}
    >
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/favicon.svg" alt="আল-ইনফাক ফাউন্ডেশন" className="h-10 w-10 shrink-0" />
          <span className="font-headline text-[1.35rem] font-normal leading-tight text-forest">
            আল-ইনফাক
            <span className="block font-body text-[11px] font-normal text-ink/55">ফাউন্ডেশন</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {desktopLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `group relative whitespace-nowrap py-2 text-[0.92rem] font-medium transition-colors ${
                  isActive ? "text-forest" : "text-ink/70 hover:text-forest"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gold transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          {isAdmin && (
            <Link
              to="/admin"
              className="whitespace-nowrap rounded-full border border-gold/50 px-3.5 py-1.5 text-[0.82rem] font-semibold text-gold-dark transition-colors hover:bg-gold/10"
            >
              অ্যাডমিন
            </Link>
          )}
          <Link to="/donate" className="btn-gold !px-5 !py-2 whitespace-nowrap text-sm">
            দান করুন
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="max-w-[7.5rem] truncate text-sm font-medium text-ink/75 hover:text-forest"
                title={user.displayName || "আমার একাউন্ট"}
              >
                {user.displayName || "আমার একাউন্ট"}
              </Link>
              <button
                onClick={handleLogout}
                className="whitespace-nowrap text-sm font-medium text-ink/55 underline-offset-4 hover:text-clay hover:underline"
              >
                লগআউট
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary !px-5 !py-2 whitespace-nowrap text-sm">
              লগইন
            </Link>
          )}
        </div>

        <button
          className="-mr-2 rounded-lg p-2 text-forest hover:bg-forest/5 xl:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-line bg-canvas xl:hidden">
          <div className="mx-auto max-w-7xl px-5 pb-6 pt-2">
            {mobileLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-line/70 py-3.5 text-[1.02rem] font-medium ${
                    isActive ? "text-forest" : "text-ink/80"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && <span className="h-2 w-2 rounded-full bg-gold" />}
                  </>
                )}
              </NavLink>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              <Link to="/donate" className="btn-gold w-full">
                দান করুন
              </Link>
              {isAdmin && (
                <Link to="/admin" className="btn-secondary w-full">
                  অ্যাডমিন প্যানেল
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-secondary w-full">
                    {user.displayName || "আমার একাউন্ট"}
                  </Link>
                  <button onClick={handleLogout} className="py-2 text-sm font-medium text-ink/60 hover:text-clay">
                    লগআউট
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary w-full">
                  লগইন
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
