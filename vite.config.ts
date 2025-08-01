import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/wasteland/' : '/',
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
}))
