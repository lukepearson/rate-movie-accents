import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('daisyui'),
  ],
} satisfies Config;
