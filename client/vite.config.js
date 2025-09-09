import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to Express server
      '/api': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/dashboard': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
