import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg:              "#06050D",
        surface:         "#09071A",
        "surface-2":     "#0E0C22",
        card:            "#110F28",
        "card-hover":    "#161330",
        border:          "#1E1A3A",
        "border-2":      "#2A2550",
        purple:          "#8B5CF6",
        "purple-bright": "#A78BFA",
        "purple-muted":  "#6D28D9",
        "purple-dark":   "#4C1D95",
        "purple-subtle": "#1A1035",
        platinum:        "#B0BAD0",
        "text-1":        "#EDF0FA",
        "text-2":        "#7875A8",
        "text-3":        "#3D3868",
        success:         "#22D07A",
        "success-bg":    "#071A10",
        warning:         "#F59E0B",
        danger:          "#E05252",
        "danger-bg":     "#1F0D0D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        purple:       "0 0 60px rgba(139, 92, 246, 0.18)",
        "purple-sm":  "0 0 20px rgba(139, 92, 246, 0.10)",
        card:         "0 4px 32px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 8px 48px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "purple-gradient": "linear-gradient(135deg, #6D28D9 0%, #A78BFA 50%, #6D28D9 100%)",
        "hero-gradient":   "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(109,40,217,0.18) 0%, transparent 70%)",
        "card-gradient":   "linear-gradient(135deg, rgba(17,15,40,0.85) 0%, rgba(14,12,34,0.9) 100%)",
        "dot-pattern":     "radial-gradient(circle, rgba(42,37,80,0.6) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-sm": "24px 24px",
        "dot-md": "32px 32px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        shimmer:   "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
