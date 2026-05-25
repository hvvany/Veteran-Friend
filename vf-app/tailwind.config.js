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
        // 브랜드 컬러 Option 1. Modern Professional
        // Cobalt Blue #2E5BFF (활기) / Slate Blue #4A5568 (든든함) / Electric Silver #E2E8F0 (미래)
        primary: {
          50:  "#EEF3FF",
          100: "#DDEAFF",
          200: "#B9D0FF",
          300: "#84ACFF",
          400: "#5587FF",
          500: "#3E6EFF",
          600: "#2E5BFF", // ← 브랜드 메인 Cobalt Blue
          700: "#2347D4",
          800: "#1A34A0",
          900: "#12236D",
        },
        gold: {
          400: "#FBBF24", // Sun Gold — 베테랑/리스펙트 강조
          500: "#F59E0B",
          600: "#D97706",
        },
        slate: {
          500: "#64748B",
          600: "#4A5568", // Slate Blue — 든든함 & 실용
          700: "#374151",
        },
        silver: {
          DEFAULT: "#E2E8F0", // Electric Silver — 페이지 배경
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
