import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Set VITE_BASE=/repo-name/ when deploying under a sub-path (GitHub Pages project sites).
export default defineConfig({
  base: "/fluxplugindoc/",
  //base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
});
