import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: './', // روٹ ڈائریکٹری کو واضح کریں
  build: {
    outDir: 'dist',
    sourcemap: false, // سیکیورٹی کے لیے سورس میپ بند
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  }
})
