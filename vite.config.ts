import { defineConfig } from 'vite';

export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/',
  define: {
    __BUILD_SHA__: JSON.stringify(process.env.VITE_BUILD_SHA ?? '')
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['crypto-js', 'file-saver']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}));
