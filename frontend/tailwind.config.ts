import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6F2",
        ink: "#1C1614",
        rosegold: {
          DEFAULT: "#B76E79",
          light: "#D9A7AE",
          dark: "#8C4A54",
        },
        gold: {
          DEFAULT: "#C9A227",
          soft: "#E4C976",
        },
        blush: "#F1D9D4",
        plum: "#6E2A35",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(28,22,20,0.25)",
        card: "0 10px 30px -12px rgba(110,42,53,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
