/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          main: "#0f172a",
          sidebar: "#111827",
          card: "#1e293b",
        },
        border: {
          main: "#334155",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
        },
        brand: {
          green: "#22c55e",
          red: "#ef4444",
          blue: "#3b82f6",
        }
      },
      borderRadius: {
        '2xl': '16px',
      },
      backgroundImage: {
        'accent-gradient': "linear-gradient(to right, #3b82f6, #2563eb)",
      },
    },
  },
  plugins: [],
};
