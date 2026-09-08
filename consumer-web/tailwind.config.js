/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          50: "#FFFDF5",
          100: "#FEF7DF",
          200: "#FDECB5",
          300: "#FBDD82",
          400: "#F6C645",
          500: "#EBA818",
          600: "#CF840E",
          700: "#A55F0E",
          800: "#864B13",
          900: "#6F3E14",
        },
        umber: {
          50: "#F9F6F0",
          100: "#EFEBE0",
          200: "#E0D7C5",
          300: "#CABE9F",
          700: "#5D4037",
          800: "#3D2418",
          900: "#24140D",
          950: "#170C08",
        },
        cream: {
          50: "#FCFAF6",
          100: "#F8F4EB",
          200: "#F1EAD9",
        },
        forest: {
          800: "#1A3D2A",
          900: "#112A1D",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "verdict-reveal": "verdictSpring 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        verdictSpring: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
      },
    },
  },
  plugins: [],
};
