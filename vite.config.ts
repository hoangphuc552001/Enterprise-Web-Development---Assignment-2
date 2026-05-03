import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Skill 1: vite-project-setup — standard Vite config with React plugin and dev port
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
