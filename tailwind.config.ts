import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Atelier palette — dark warm + brass + flame
        obsidian: "rgb(var(--obsidian) / <alpha-value>)",   // #0C0A08
        coal:     "rgb(var(--coal) / <alpha-value>)",       // #161310
        ash:      "rgb(var(--ash) / <alpha-value>)",        // #24201B
        bone:     "rgb(var(--bone) / <alpha-value>)",       // #EBE2D3
        cream:    "rgb(var(--cream) / <alpha-value>)",      // #F4EDE0
        mist:     "rgb(var(--mist) / <alpha-value>)",       // #9C9180
        smoke:    "rgb(var(--smoke) / <alpha-value>)",      // #5E574D
        brass: {
          DEFAULT: "#C9A55C",
          50:  "#FBF7EC",
          100: "#F5ECCF",
          200: "#EBD89E",
          300: "#DDC06A",
          400: "#D0AE4E",
          500: "#C9A55C",
          600: "#A38241",
          700: "#7E6432",
          800: "#5A4724",
          900: "#3A2E18",
        },
        flame: {
          DEFAULT: "#FF6B35",
          50:  "#FFF1EA",
          100: "#FFE0D1",
          200: "#FFBE9F",
          300: "#FF9B6D",
          400: "#FF8550",
          500: "#FF6B35",
          600: "#ED4F18",
          700: "#C53D0E",
          800: "#9C310F",
          900: "#7E2A12",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
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
