import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    preview: {
        port: 80,
    },
    css: {
        preprocessorOptions: {
            // Включение именования классов (по умолчанию '[name]__[local]')
            localsConvention: "camelCase",
            // Использование хэшей для имен классов
            generateScopedName: "[hash:base64]",
        },
    },
    build: {
        assetsDir: "styles",
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                },
            },
        },
        minify: true,
        cssCodeSplit: true,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://backend:3000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/ws": {
                target: "ws://backend:3001",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/ws/, ""),
            },
        },
        host: true,
    },
});
