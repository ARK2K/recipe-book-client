import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/* export default defineConfig({
  plugins: [react()],
}) */

export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://recipe-book-server-5u08.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/ping': {
        target: 'https://recipe-book-server-5u08.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
};
