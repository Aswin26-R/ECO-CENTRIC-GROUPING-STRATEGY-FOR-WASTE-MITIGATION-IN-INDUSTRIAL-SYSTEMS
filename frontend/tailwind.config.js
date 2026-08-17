/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: "#f5f6f6",
          100: "#e6e8e8",
          200: "#c7cccb",
          300: "#a2a9a8",
          400: "#767f7e",
          500: "#5a6362",
          600: "#454d4c",
          700: "#383e3d",
          800: "#262b2a",
          900: "#181c1b",
        },
        forge: {
          50: "#eef8f1",
          100: "#d4eedd",
          200: "#a9ddbb",
          300: "#78c797",
          400: "#4bab76",
          500: "#2f8f5c",
          600: "#22734a",
          700: "#1c5c3d",
          800: "#194a33",
          900: "#153e2b",
        },
        rust: {
          400: "#c07a4a",
          500: "#a8622f",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,28,27,0.06), 0 1px 3px rgba(24,28,27,0.08)",
      },
    },
  },
  plugins: [],
};
