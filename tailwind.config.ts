import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0c1e32", light: "#152d47" },
        rust: { DEFAULT: "#e85d3a", dark: "#c9472a", soft: "#fff0eb" },
        orange: { DEFAULT: "#e85d3a", dark: "#c9472a", soft: "#fff0eb" },
        coral: { DEFAULT: "#e85d3a", dark: "#c9472a", soft: "#fff0eb" },
        blue: { DEFAULT: "#e85d3a", dark: "#c9472a", soft: "#fff0eb" },
        mauve: { DEFAULT: "#98839f", light: "#f2edf3" },
        yellow: { DEFAULT: "#1f3d2b", soft: "#e8f3ed" },
        mint: { DEFAULT: "#1f3d2b", soft: "#e8f3ed" },
        ink: { DEFAULT: "#14171c", secondary: "#5b6472", muted: "#98a2b3" },
        surface: { DEFAULT: "#f6f7f9", warm: "#ffffff" },
        line: { DEFAULT: "#e2e6eb", light: "#eef0f2" }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      borderRadius: {
        brand: "8px"
      },
      boxShadow: {
        card: "0 10px 28px rgba(12, 30, 50, 0.08)"
      },
      maxWidth: {
        prose: "70ch"
      }
    }
  },
  plugins: []
};

export default config;
