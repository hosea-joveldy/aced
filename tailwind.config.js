/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        state: {
          overdue: "hsl(var(--state-overdue))",
          "overdue-bg": "hsl(var(--state-overdue-bg))",
          "needs-date": "hsl(var(--state-needs-date))",
          "needs-date-bg": "hsl(var(--state-needs-date-bg))",
          today: "hsl(var(--state-today))",
          "today-bg": "hsl(var(--state-today-bg))",
          done: "hsl(var(--state-done))",
          "done-bg": "hsl(var(--state-done-bg))",
          undone: "hsl(var(--state-undone))",
          "undone-bg": "hsl(var(--state-undone-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['"Playfair Display"', '"Instrument Serif"', "ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
      },
    },
  },
  plugins: [],
};
