import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette "blu notte + oro" — premium / trust
        //  base scura = night blue (CSS vars), accent = oro (brass) + ambra (flame)
        obsidian: "rgb(var(--obsidian) / <alpha-value>)",   // #0B1220
        coal:     "rgb(var(--coal) / <alpha-value>)",       // #131C2E
        ash:      "rgb(var(--ash) / <alpha-value>)",        // #1C2840
        bone:     "rgb(var(--bone) / <alpha-value>)",       // #EAF0F7
        cream:    "rgb(var(--cream) / <alpha-value>)",      // #F5F8FC
        mist:     "rgb(var(--mist) / <alpha-value>)",       // #8A97AB
        smoke:    "rgb(var(--smoke) / <alpha-value>)",      // #525E70
        // brass — azzurro scuro: titoli, titoletti, parole evidenziate, CTA, bordi
        brass: {
          DEFAULT: "#2E6FB0",
          50:  "#ECF3FB",
          100: "#D5E4F5",
          200: "#AECBEC",
          300: "#7FACDE",
          400: "#4F8BCC",
          500: "#2E6FB0",
          600: "#265D95",
          700: "#204C79",
          800: "#1A3C5F",
          900: "#142E49",
        },
        // flame — azzurro brillante: "in 48 ore", prezzi, urgenza, glow su blu
        flame: {
          DEFAULT: "#38BDF8",
          50:  "#EAF8FE",
          100: "#D0F0FD",
          200: "#A6E4FB",
          300: "#6FD3F8",
          400: "#4FC8F6",
          500: "#38BDF8",
          600: "#1A9FD8",
          700: "#1480B0",
          800: "#135F82",
          900: "#14506B",
        },
        // steel — blu acciaio freddo: glow ambientali, dettagli secondari
        steel: {
          DEFAULT: "#5B7FA6",
          400: "#7C9BBE",
          500: "#5B7FA6",
          600: "#47678A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.025em",
        widest: "0.3em",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "marquee": "marquee 40s linear infinite",
        "glow": "glow 8s ease-in-out infinite alternate",
        "glow-slow": "glow 14s ease-in-out infinite alternate",
        "shimmer": "shimmer 3s linear infinite",
        "draw": "draw 1.2s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%":   { opacity: "0.4", transform: "translate(0, 0) scale(1)" },
          "100%": { opacity: "0.7", transform: "translate(40px, -30px) scale(1.15)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        draw: {
          "0%":   { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
