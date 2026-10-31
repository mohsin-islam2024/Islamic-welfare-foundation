/** @type {import('tailwindcss').Config} */

// আটমুখী তারা (খাতাম) — দুটি বর্গক্ষেত্র ৪৫° ঘুরিয়ে বসানো; হালকা প্যাটার্ন হিসেবে টাইল করা হয়
const khatam = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23E3B85C' stroke-opacity='.16' stroke-width='1'%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Crect x='20' y='20' width='40' height='40' transform='rotate(45 40 40)'/%3E%3Ccircle cx='0' cy='0' r='7'/%3E%3Ccircle cx='80' cy='0' r='7'/%3E%3Ccircle cx='0' cy='80' r='7'/%3E%3Ccircle cx='80' cy='80' r='7'/%3E%3C/g%3E%3C/svg%3E")`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10241C",
        canvas: "#FBF8F2",
        forest: {
          DEFAULT: "#14392B",
          light: "#1F5A44",
          dark: "#0A2219",
        },
        jade: "#2A7A5B",
        gold: {
          DEFAULT: "#B8862E",
          light: "#E3B85C",
          dark: "#8C6620",
        },
        clay: "#C1573B",
        line: "#E7DFCB",
      },
      fontFamily: {
        // display: সব হেডিং (ভ্যারিয়েবল ওয়েট), headline: বড় শিরোনামে মার্জিত সেরিফ (ওয়েট ১টি; font-normal ব্যবহার করুন)
        display: ["'Noto Serif Bengali'", "'Noto Serif'", "serif"],
        headline: ["'Tiro Bangla'", "'Noto Serif Bengali'", "'Noto Serif'", "serif"],
        body: ["'Noto Sans Bengali'", "'Noto Sans'", "sans-serif"],
      },
      boxShadow: {
        panel: "0 40px 80px -40px rgba(10,34,25,0.55)",
        gold: "0 12px 30px -12px rgba(184,134,46,0.65)",
        forest: "0 12px 28px -12px rgba(20,57,43,0.7)",
      },
      backgroundImage: {
        lattice: "radial-gradient(circle at 1px 1px, rgba(27,67,50,0.08) 1px, transparent 0)",
        "islamic-pattern": khatam,
        "hero-glow":
          "radial-gradient(70% 60% at 85% 15%, rgba(42,122,91,0.55), transparent 60%), radial-gradient(45% 45% at 5% 100%, rgba(184,134,46,0.16), transparent 70%), linear-gradient(165deg, #0A2219 0%, #0F3024 60%, #0A2219 100%)",
      },
      backgroundSize: {
        "lattice-size": "22px 22px",
        "pattern-size": "80px 80px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spin360: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "spin-slow": "spin360 140s linear infinite",
        "spin-slow-rev": "spin360 200s linear infinite reverse",
      },
    },
  },
  plugins: [],
};
