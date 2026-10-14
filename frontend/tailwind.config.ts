import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#0C0B10",
        surface: "#16141D",
        "surface-2": "#1F1C2A",
        ivory: "#F5F3FA",
        volt: {
          DEFAULT: "#D4F23A",
          dim: "#A9C22A",
          bright: "#E6FF5C",
        },
        violet: {
          DEFAULT: "#A78BFA",
          dim: "#7C5CE0",
        },
        muted: "#A39FB5",
        danger: "#FF6B81",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      borderRadius: {
        sharp: "2px",
        soft: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
