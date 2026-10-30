import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#5b7b28",
          "green-dark": "#435d1c",
          "green-light": "#769d35",
          amber: "#e48e38",
          "amber-dark": "#c27123",
          olive: "#6b8e23",
          cream: "#fbf9f4",
          "cream-dark": "#f3eee3",
          dark: "#1c1917",
          primary: "#d97706",
          accent: "#dc2626",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        script: ["Brush Script MT", "Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
