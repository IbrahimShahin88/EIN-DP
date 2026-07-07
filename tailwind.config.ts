import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sand: "#f7f3ea",
        brass: "#b4873a",
        field: "#0f766e",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 24, 39, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
