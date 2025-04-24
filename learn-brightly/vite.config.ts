import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Remove incorrect import and use the correct one
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ["bd75-103-97-104-148.ngrok-free.app"]
  }
})