import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0E1117",
        card: "#111827",
        accent: "#7C83FF",
        accentMuted: "#4B4E6D",
        border: "#1F2937"
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 131, 255, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
