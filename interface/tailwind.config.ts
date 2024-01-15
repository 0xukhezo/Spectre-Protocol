import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderWidth: {
        1: "1px",
      },
      colors: {
        main: "#d2c3f6",
        secondary: "#ac8cfb",
        navbarActive: "linear-gradient(to bottom, #ffffff 40%, #d2c3f6)",
        transparentLine:
          "linear-gradient(to right, transparent, #d2c3f6, transparent)",
      },
      gridTemplateColumns: {
        "15": "repeat(15, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
      },
    },
  },
  plugins: [],
};
export default config;
