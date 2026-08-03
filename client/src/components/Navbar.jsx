import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "প্রচ্ছদ" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/programs", label: "কার্যক্রম" },
  { to: "/loan-application", label: "কর্জে হাসানাহ" },
  { to: "/donate", label: "দান করুন" },
  { to: "/contact", label: "যোগাযোগ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur border-b border-line">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="আল-ইনফাক ফাউন্ডেশন" className="w-9 h-9 shrink-0" />
          <span className="font-display font-semibold text-lg leading-tight text-forest">
            আল-ইনফাক
            <span className="block text-[11px] font-body font-normal tracking-wide text-ink/60">
              ফাউন্ডেশন
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-forest" : "text-ink/70 hover:text-forest"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-gold-dark hover:underline">
              অ্যাডমিন প্যানেল
            </Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-ink/70 hover:text-forest">
                {user.displayName || "আমার একাউন্ট"}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-sm">
                লগআউট
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary !py-2 !px-5 text-sm">
              লগইন
            </Link>
          )}
        </div>

        <button
          className="lg:hidden p-2 text-forest"
          onClick={() => setOpen((o) => !o)}
          aria-label="মেনু খুলুন"
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
        <div className="lg:hidden border-t border-line bg-canvas px-5 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink/80"
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium text-gold-dark">
              অ্যাডমিন প্যানেল
            </Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
                {user.displayName || "আমার একাউন্ট"}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !py-2 text-sm w-full">
                লগআউট
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary !py-2 text-sm w-full">
              লগইন
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
