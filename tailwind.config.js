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
        // Cores dinâmicas via CSS variables — mudam com o tema
        soma: {
          bg:      "var(--soma-bg)",
          card:    "var(--soma-card)",
          border:  "var(--soma-border)",
          text:    "var(--soma-text)",
          muted:   "var(--soma-muted)",
          gold:    "var(--soma-gold)",
        },
        // Mantém ph- como alias para retrocompatibilidade
        ph: {
          bg:     "var(--soma-bg)",
          card:   "var(--soma-card)",
          border: "var(--soma-border)",
          text:   "var(--soma-text)",
          muted:  "var(--soma-muted)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};