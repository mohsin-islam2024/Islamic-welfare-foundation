/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2E28",       // deep forest ink - primary text
        canvas: "#FBF8F2",    // warm sandstone background
        forest: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#0F2A1F",
        },
        gold: {
          DEFAULT: "#B8862E",
          light: "#D9A94F",
          dark: "#8C6620",
        },
        clay: "#C1573B",
        line: "#E4DCC8",
      },
      fontFamily: {
        display: ["'Noto Serif Bengali'", "'Noto Serif'", "serif"],
        body: ["'Noto Sans Bengali'", "'Noto Sans'", "sans-serif"],
      },
      backgroundImage: {
        "lattice": "radial-gradient(circle at 1px 1px, rgba(27,67,50,0.08) 1px, transparent 0)",
      },
      backgroundSize: {
        "lattice-size": "22px 22px",
      },
    },
  },
  plugins: [],
};
