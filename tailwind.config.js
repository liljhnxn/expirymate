/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0f",
          900: "#0e1017",
          850: "#131620",
          800: "#181b28",
          700: "#222638",
          600: "#32374d",
        },
        purple: {
          accent: "#9333ea",
          muted: "#8b5cf6",
          soft: "#a855f7",
          dark: "#581c87",
        },
        green: {
          accent: "#10b981",
          muted: "#059669",
          soft: "#34d399",
          dark: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

