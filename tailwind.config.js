/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          light:   "#f5a623",
          DEFAULT: "#c9a84c",
          dark:    "#a07830",
        },
        soma: {
          bg:      "#000000",   // preto puro
          card:    "#0d0d0d",   // card quase igual ao fundo
          border:  "#f5a623",   // borda DOURADA visível como no PDF
          text:    "#ffffff",   // branco puro
          muted:   "#aaaaaa",   // cinza claro legível
          success: "#4ade80",
          danger:  "#f87171",
          info:    "#60a5fa",
          warning: "#fbbf24",
        },
        ph: {
          bg:      "#000000",
          card:    "#0d0d0d",
          border:  "#f5a623",
          text:    "#ffffff",
          muted:   "#aaaaaa",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};