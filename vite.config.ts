import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    electron([
      {
        entry: "electron/main.ts",
      },
    ]),
  ],
  server: {
    proxy: {
      "/comptes.csv": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/comptes.csv/, "/api/comptes.csv"),
      },
    },
  },
});
