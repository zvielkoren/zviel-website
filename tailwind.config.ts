import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0e13",
        surface: "#0a0e13",
        "surface-low": "#0f1419",
        "surface-mid": "#151a20",
        "surface-high": "#1b2027",
        "surface-highest": "#21262e",
        text: "#f4f6fe",
        "text-muted": "#a8abb2",
        "text-dim": "#64748b",
        primary: "#81e9ff",
        "primary-strong": "#00e0ff",
        "primary-ink": "#004b57",
        border: "#44484e",
        danger: "#ff716c"
      },
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 224, 255, 0.14)",
        insetline: "inset 0 0 0 1px rgba(68,72,78,0.2)"
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(to right, rgba(0,224,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,224,255,0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
