import { defineConfig } from "vite-plus";

export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? "/",
  define: {
    __BUILD_SHA__: JSON.stringify(process.env.VITE_BUILD_SHA ?? ""),
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("crypto-js") || id.includes("file-saver")) {
              return "vendor";
            }
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  staged: {
    "*.{js,ts,jsx,tsx}": "eslint --fix",
    "*.{js,ts,jsx,tsx,json,css,md}": "prettier --write",
  },
}));
