import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/library_app_2026_08_06/",
  server: {
    proxy: {
      "/api/aladin": {
        target: "https://www.aladin.co.kr/ttb/api", // https로 설정하여 리다이렉트 방지
        changeOrigin: true, // Host 헤더를 target URL로 변경
        rewrite: (path) => path.replace(/^\/api\/aladin/, ""), // /api/aladin 제거 후 전송
        secure: false,
      },
    },
  },
});
