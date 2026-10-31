// আইকন + ইসলামি জ্যামিতিক অলংকরণ (আটমুখী তারা / খাতাম)

const ICONS = {
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M4.93 4.93l4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  check: <path d="M20 6L9 17l-5-5" />,
};

export function Icon({ name, className = "w-6 h-6", strokeWidth = 1.7 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const OCTAGON = "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

// আটকোণা পদক: আইকনের ফ্রেম, সোনালি সরু বর্ডারসহ
export function Medallion({ icon, tone = "light" }) {
  const inner = tone === "dark" ? "bg-forest text-gold-light" : "bg-white text-forest";
  return (
    <span
      className="relative inline-block h-14 w-14 shrink-0 bg-gold/70"
      style={{ clipPath: OCTAGON }}
      aria-hidden="true"
    >
      <span className={`absolute inset-[1.5px] flex items-center justify-center ${inner}`} style={{ clipPath: OCTAGON }}>
        <Icon name={icon} className="w-6 h-6" />
      </span>
    </span>
  );
}

// ছোট আটমুখী তারা (বিভাজক হিসেবে)
export function StarMark({ className = "w-3 h-3" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="14" height="14" />
      <rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" />
    </svg>
  );
}

// হিরোর বড় অলংকরণ: ঘূর্ণায়মান আটমুখী তারার স্তর
export function HeroOrnament({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1D58E" />
          <stop offset="1" stopColor="#B8862E" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="97" stroke="url(#goldLine)" strokeOpacity="0.35" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="90" stroke="url(#goldLine)" strokeOpacity="0.2" strokeWidth="0.5" />

      <g className="animate-spin-slow origin-svg-center" stroke="url(#goldLine)" strokeWidth="0.9">
        <rect x="42" y="42" width="116" height="116" />
        <rect x="42" y="42" width="116" height="116" transform="rotate(45 100 100)" />
      </g>

      <g className="animate-spin-slow-rev origin-svg-center" stroke="url(#goldLine)" strokeOpacity="0.7" strokeWidth="0.7">
        <rect x="62" y="62" width="76" height="76" transform="rotate(22.5 100 100)" />
        <rect x="62" y="62" width="76" height="76" transform="rotate(67.5 100 100)" />
      </g>

      <g stroke="url(#goldLine)" strokeOpacity="0.55" strokeWidth="0.6">
        <rect x="80" y="80" width="40" height="40" />
        <rect x="80" y="80" width="40" height="40" transform="rotate(45 100 100)" />
      </g>
      <circle cx="100" cy="100" r="5" fill="url(#goldLine)" />
    </svg>
  );
}
