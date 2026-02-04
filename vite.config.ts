import { defineConfig } from 'vite';

export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/',
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
