// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // <-- BARIS INI YANG MEMPERBAIKI MASALAH -->
  base: "/aplikasi-produksi-mukena/", 
  
  plugins: [react()],
})