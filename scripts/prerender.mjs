#!/usr/bin/env node
/**
 * prerender.mjs — 使用 Playwright 预渲染 SPA 为静态 HTML
 * 解决百度等搜索引擎无法渲染 JS 的 SEO 问题
 *
 * 用法: node scripts/prerender.mjs
 * 前置: npm run build
 */

import { chromium } from 'playwright'
import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, '..', 'dist')
const BASE_PATH = '/trainhub'
const PORT = 4173

// 所有需要预渲染的路由
const routes = [
  '/',
  '/trainers',
  '/courses',
  '/blog',
  '/join',
  '/faq',
  '/match',
  '/about',
  '/assessment',
  // 培训师详情 (15)
  ...Array.from({ length: 15 }, (_, i) => `/trainers/${i + 1}`),
  // 课程详情 (17)
  ...Array.from({ length: 17 }, (_, i) => `/courses/${i + 1}`),
  // 分类专题 (6)
  '/topics/leadership',
  '/topics/sales',
  '/topics/digital',
  '/topics/hr',
  '/topics/finance',
  '/topics/communication',
  // 博客文章 (50)
  '/blog/enterprise-training-industry-disruption',
  '/blog/how-to-choose-ai-training-course',
  '/blog/leadership-training-trends-2026',
  '/blog/how-to-evaluate-trainer-quality',
  '/blog/training-roi-measurement',
  '/blog/freelance-trainer-pricing-guide',
  '/blog/new-manager-first-90-days',
  '/blog/enterprise-training-budget-planning-2026',
  '/blog/training-needs-analysis-methods',
  '/blog/digital-training-trends-2026',
  '/blog/annual-training-plan-design',
  '/blog/online-vs-offline-training',
  '/blog/training-effectiveness-evaluation',
  '/blog/how-to-choose-training-provider',
  '/blog/new-employee-onboarding-training-guide',
  '/blog/how-to-build-internal-training-system',
  '/blog/middle-management-training-courses',
  '/blog/team-building-training-program',
  '/blog/sales-team-training-program',
  '/blog/how-to-choose-training-platform',
  '/blog/manufacturing-training-program-design',
  '/blog/corporate-learning-map-guide',
  '/blog/why-training-fails-solutions',
  '/blog/finance-industry-training-program',
  '/blog/healthcare-training-compliance-guide',
  '/blog/annual-training-summary-report-template',
  '/blog/retail-industry-training-program',
  '/blog/training-needs-survey-template',
  '/blog/it-industry-tech-training-program',
  '/blog/education-industry-training-program',
  '/blog/trainer-evaluation-form-template',
  '/blog/logistics-industry-training-program',
  '/blog/energy-industry-training-program',
  '/blog/training-effectiveness-tracking-template',
  '/blog/catering-industry-training-program',
  '/blog/construction-industry-training-program',
  '/blog/training-project-proposal-template',
  '/blog/internal-trainer-development-system',
  '/blog/china-training-market-trends-2026',
  '/blog/training-contract-agreement-template',
  '/blog/high-potential-talent-development-program',
  '/blog/top-training-course-directions-2026',
  '/blog/trainer-personal-brand-building-guide',
  '/blog/training-supplier-management-strategy',
  '/blog/hotel-industry-training-program',
  '/blog/enterprise-digital-transformation-training-guide',
  '/blog/trainer-invitation-letter-template',
  '/blog/automotive-industry-training-program',
  '/blog/training-budget-application-template',
  '/blog/training-full-process-management-guide',
  '/blog/real-estate-industry-training-program',
  '/blog/training-course-development-guide',
  '/blog/cross-department-collaboration-training',
  // 免费工具 (2)
  '/tools/budget-calculator',
  '/tools/roi-calculator',
]

/** 简易静态文件服务器 */
function startServer() {
  return new Promise((resolve) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.woff2': 'font/woff2',
    }

    // 预渲染 / 路由会覆盖 dist/index.html，预先缓存 SPA shell 到内存
    const spaShell = readFileSync(join(DIST_DIR, 'index.html'))

    const server = createServer((req, res) => {
      let filePath = join(DIST_DIR, req.url.replace(BASE_PATH, ''))

      // SPA fallback: 所有非文件请求返回缓存的 SPA shell
      if (!filePath.includes('.')) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(spaShell)
        return
      }

      try {
        const ext = '.' + filePath.split('.').pop()
        const content = readFileSync(filePath)
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
        res.end(content)
      } catch {
        // fallback to cached SPA shell
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(spaShell)
      }
    })

    server.listen(PORT, () => {
      console.log(`  Static server on http://localhost:${PORT}`)
      resolve(server)
    })
  })
}

/** 预渲染单个路由 */
async function prerenderRoute(page, route) {
  const url = `http://localhost:${PORT}${BASE_PATH}${route}`
  await page.goto(url, { waitUntil: 'networkidle' })

  // 等待 React 渲染完成
  await page.waitForSelector('#root > *', { timeout: 10000 })

  // 获取完整 HTML
  let html = await page.content()

  // 注入 prerender 标记，方便调试
  html = html.replace(
    '</head>',
    `<meta name="prerender-status" content="prerendered">\n</head>`
  )

  // 写入文件
  const filePath = route === '/'
    ? join(DIST_DIR, 'index.html')
    : join(DIST_DIR, route.slice(1), 'index.html')

  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  writeFileSync(filePath, html, 'utf-8')
  return filePath
}

// ─── Main ───
async function main() {
  console.log('\n  Prerendering SPA routes...\n')

  // 检查 dist 目录
  if (!existsSync(DIST_DIR)) {
    console.error('  dist/ not found. Run "npm run build" first.')
    process.exit(1)
  }

  const server = await startServer()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  let success = 0
  let failed = 0

  for (const route of routes) {
    try {
      const filePath = await prerenderRoute(page, route)
      const relPath = filePath.replace(DIST_DIR, 'dist')
      console.log(`  OK  ${route} → ${relPath}`)
      success++
    } catch (err) {
      console.error(`  FAIL  ${route}: ${err.message}`)
      failed++
    }
  }

  await browser.close()
  server.close()

  console.log(`\n  Done: ${success} OK, ${failed} failed, ${routes.length} total\n`)

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
