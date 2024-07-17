/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary1: "#4cc3a4",
        primary2: "#8cdf9b",
        background: "#131417",
        backgroundShade: "#1D1F24",
        navbarContent: "#D9D9D9",
        textWhite: "#E9E8E8",
        textGray: "#7C7C7C"
      },
      fontSize: {
        "heading": "24px"
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
