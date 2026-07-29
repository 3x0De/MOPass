import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry: "electron/main.ts",
      },
    ]),
    renderer(),
  ],
  server: {
    proxy: {
      '/comptes.csv': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/comptes.csv/, '/api/comptes.csv'),
      },
    },
  },
});
