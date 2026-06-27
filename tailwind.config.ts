import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf8f0",
          100: "#faefd8",
          200: "#f3d9a8",
          300: "#e8bc6e",
          400: "#db9a3a",
          500: "#c97d1e",
          600: "#a96218",
          700: "#884b18",
          800: "#6e3c1a",
          900: "#5a3118",
        },
        cream: "#faf7f2",
        charcoal: "#1c1917",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
