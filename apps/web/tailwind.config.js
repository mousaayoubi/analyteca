export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee", // cyan
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        brandBlue: {
          400: "#38bdf8", // sky
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,.15), 0 10px 30px rgba(2,132,199,.15)",
      },
    },
  },
  plugins: [],
};
