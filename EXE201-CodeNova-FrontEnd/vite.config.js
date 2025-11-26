import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 🚀 THÊM DÒNG NÀY: Cho phép truy cập từ IP mạng LAN (ví dụ: 10.63.19.51)
    host: true, 
    port: 5173,
  }
})