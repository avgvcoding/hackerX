/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        muted: "#64748b",
        line: "#e2e8f0",
        page: "#f0f4f9",
        surface: "#f6f8fb",
        indigoInk: "#1e3a5f",
        martOrange: "#f59e0b",
        martBlue: "#2563eb",
        success: "#10b981",
        warning: "#d97706",
        danger: "#ef4444",
        sidebar: "#0f1729",
        "sidebar-hover": "rgba(37, 99, 235, 0.1)"
      },
      boxShadow: {
        panel: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)",
        glow: "0 0 20px rgba(37, 99, 235, 0.1)"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px"
      },
      animation: {
        "fade-in-up": "fadeInUp 0.35s ease-out both",
        "fade-in": "fadeIn 0.3s ease-out both",
        "slide-in": "slideInRight 0.3s ease-out both"
      }
    }
  },
  plugins: []
};
