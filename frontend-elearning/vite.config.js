import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true, 
    port: 5173,
    watch: {
      usePolling: true, // Force la détection des changements de fichiers sous Docker
    },
  },
})