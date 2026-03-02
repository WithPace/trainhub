import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/trainhub/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心 — 版本稳定，长期缓存
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // 图标库单独分块 — 体积大但变动少
          icons: ['lucide-react'],
        },
      },
    },
  },
  server: {
    proxy: {
      // 开发时将 /api 请求代理到本地 wrangler dev
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
