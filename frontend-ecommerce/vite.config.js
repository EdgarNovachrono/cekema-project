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
    host: true, // Écoute sur 0.0.0.0 pour Docker
    port: 5173,
    strictPort: true, // Empêche Vite de changer de port si le 5173 est pris dans le conteneur
    watch: {
      usePolling: true, // Indispensable pour ta partition /media/... sous Ubuntu
    },
    hmr: {
      clientPort: 4000, // <--- TRÈS IMPORTANT : Dit au navigateur d'écouter sur le port externe d'Ubuntu
    },
  },
})
