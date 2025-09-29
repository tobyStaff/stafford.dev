import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from parent directory
  const env = loadEnv(mode, '../', '')
  const serverPort = env.PORT || 3000
  const clientPort = env.CLIENT_PORT || 3001

  return {
    plugins: [react()],
    server: {
      port: parseInt(clientPort),
      proxy: {
        // Proxy API requests to Express server
        '/api': `http://localhost:${serverPort}`,
        '/auth': `http://localhost:${serverPort}`,
        // '/login': `http://localhost:${serverPort}`,
        '/logout': `http://localhost:${serverPort}`,
        '/dashboard': `http://localhost:${serverPort}`,
        '/health': `http://localhost:${serverPort}`,
      }
    },
    build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'html2pdf': ['html2pdf.js']
        }
      }
    }
  }
}});
