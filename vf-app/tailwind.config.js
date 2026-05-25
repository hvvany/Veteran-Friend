/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러 - 신뢰감 있는 딥 네이비 + 따뜻한 골드
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#1e40af",
          600: "#1d4ed8",
          700: "#1e3a8a",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        senior: {
          bg: "#fef9f0",
          text: "#92400e",
          border: "#fde68a",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
