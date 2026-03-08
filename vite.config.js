import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // یقینی بناتا ہے کہ Vite روٹ میں انڈیکس فائل تلاش کرے
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // سیکیورٹی کے لیے سورس میپ بند
    rollupOptions: {
      output: {
        manualChunks: {
          // آپ کے موجودہ فائل اسٹرکچر کے مطابق درست راستے
          security: ['./src/security/FinalSecurityShield.js'], 
          vendor: ['react', 'react-dom', 'react-router-dom', 'firebase'],
        },
      },
    },
  },
  base: '/', 
})
