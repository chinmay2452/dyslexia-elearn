import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ["5458-2409-40c2-12af-f1b9-1c2-cdd8-5cff-cff3.ngrok-free.app"]
  }
})