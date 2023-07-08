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
            "/api/v1": {
                target: "http://backend:8000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        },
        watch: {
            usePolling: true
        },
        host: true
    }
});
