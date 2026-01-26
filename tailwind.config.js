/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores principales - Tema Estadio
        primary: "#10b981", // Verde césped vibrante
        secondary: "#059669", // Verde oscuro
        accent: "#fbbf24", // Dorado/Amarillo (tarjetas, premios)

        // Fondos oscuros premium
        "dark-bg": "#0f172a", // Slate 900 - Fondo principal
        "dark-card": "#1e293b", // Slate 800 - Cards
        "dark-hover": "#334155", // Slate 700 - Hover states

        // Estados
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
    },
  },
  plugins: [],
};
