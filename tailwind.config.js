/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include every file that can contain NativeWind utility classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff4ff",
          100: "#dbe5ff",
          200: "#b7caff",
          300: "#8daafc",
          400: "#5a82f6",
          500: "#3461ea",
          600: "#274ac2",
          700: "#203c9d",
          800: "#1d357f",
          900: "#172c60",
        },
        indigo: {
          400: "#6f7bf7",
          500: "#5558ff",
          600: "#3431d8",
        },
        fuchsia: {
          400: "#d66bff",
          500: "#be4bff",
        },
        slate: {
          25: "#f8fafc",
          50: "#f1f5f9",
          100: "#e2e8f0",
          200: "#cbd5f5",
        },
        success: "#1ab371",
        warning: "#f7b731",
        info: "#4cc3ff",
        surface: "#ffffff",
        surfaceMuted: "#f6f7fb",
        ink: "#101828",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 15px 35px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
}
