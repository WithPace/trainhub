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
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // React 全家桶（含 scheduler/react-dom/client 等子模块）
          if (/node_modules\/(react|react-dom|scheduler|react-router)/.test(id)) {
            return 'vendor'
          }
          // 图标库 — tree-shaken，变动少
          if (id.includes('lucide-react')) return 'icons'
          // CSS 工具库 — 极少变动
          if (/tailwind-merge|clsx/.test(id)) return 'tw-utils'
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
