import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Run Vite on port 3000
    open: true, // Automatically open in the browser (optional)
    strictPort: true, // Ensures the server runs only on this port
  },
});
