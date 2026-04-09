/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#c9a84c",
          DEFAULT: "#a8762e",
          dark: "#7a5520",
        },
        ph: {
          bg: "#0a0a08",
          card: "#111008",
          border: "#2a2820",
          text: "#e8e4d8",
        },
        soma: {
          bg: "#f7f5f0",
          card: "#ffffff",
          border: "#ddd8cc",
          text: "#1a1610",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};