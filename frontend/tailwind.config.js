/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00ACC1",
        primaryDark: "#00838F",
      },
    },
  },
  plugins: [],
};
