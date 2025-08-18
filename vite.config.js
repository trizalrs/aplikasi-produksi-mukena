// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') {
    // Konfigurasi untuk build (saat menjalankan npm run deploy)
    return {
      base: "/aplikasi-produksi-mukena/",
      plugins: [react()],
    }
  } else {
    // Konfigurasi untuk development (saat menjalankan yarn dev)
    return {
      plugins: [react()],
    }
  }
})