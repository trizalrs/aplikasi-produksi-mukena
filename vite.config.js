// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Gunakan base path ini untuk SEMUA kondisi (dev dan build)
  base: "/aplikasi-produksi-mukena/", 
  plugins: [react()],
})