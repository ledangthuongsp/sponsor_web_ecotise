import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Chỉ định thư mục gốc cho Vite
  resolve: {
      alias: {
          '@': '/src', // Alias cho thư mục src
      },
  },
  base:'/sponsor_web_ecotise/'
})
