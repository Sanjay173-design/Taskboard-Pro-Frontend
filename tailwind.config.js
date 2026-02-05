/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        ink: "#0f172a",
        muted: "#64748b",
        surface: "#ffffff",
        subtle: "#f8fafc",
        accent: "#2563eb",
        border: "#e2e8f0",
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
