import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  darkMode: 'class', // This is important!
  theme: {
    extend: {},
  },
  plugins: [react(), tailwindcss()
],
});
