import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return 'react-vendor'
          }
          if (/\/node_modules\/(react-router|react-router-dom|@remix-run\/router)\//.test(id)) {
            return 'router-vendor'
          }
          if (/\/node_modules\/motion\//.test(id)) {
            return 'motion-vendor'
          }
        },
      },
    },
  },
})
