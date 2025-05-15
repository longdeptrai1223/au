import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './client/src'),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/client"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "client/index.html")
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
