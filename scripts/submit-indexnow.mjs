#!/usr/bin/env node
/**
 * submit-indexnow.mjs — 部署后自动向 IndexNow 提交 URL
 * 支持 Bing、Yandex、Seznam、Naver 等所有 IndexNow 兼容引擎
 *
 * 动态从 blog-meta.ts 读取文章列表，避免硬编码遗漏
 *
 * 用法: node scripts/submit-indexnow.mjs
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_META_PATH = join(ROOT, 'src/data/blog-meta.ts')

const SITE_URL = 'https://withpace.github.io'
const KEY = '8a831d8d3a0448a3a7a9c66023a176c6'
const KEY_LOCATION = `${SITE_URL}/trainhub/${KEY}.txt`

/**
 * 从 blog-meta.ts 提取所有文章 id
 * 用正则解析 TS 源码，避免依赖 tsx/ts-node
 */
function parseBlogIds() {
  const source = readFileSync(BLOG_META_PATH, 'utf-8')
  const idRegex = /id:\s*'([^']+)'/g
  return [...source.matchAll(idRegex)].map(m => m[1])
}

/** 构建所有可索引 URL（与 sitemap.xml 保持一致） */
function buildUrlList() {
  const blogIds = parseBlogIds()

  const urls = [
    // 核心页面
    '/trainhub/',
    '/trainhub/trainers',
    '/trainhub/courses',
    '/trainhub/blog',
    '/trainhub/join',
    '/trainhub/faq',
    '/trainhub/match',
    '/trainhub/about',
    '/trainhub/assessment',
    '/trainhub/tools/budget-calculator',
    '/trainhub/tools/roi-calculator',
    // 付费工具包
    '/trainhub/toolkit',
    // 工具包模板详情 (6)
    '/trainhub/toolkit/needs-analysis',
    '/trainhub/toolkit/annual-plan',
    '/trainhub/toolkit/effectiveness-eval',
    '/trainhub/toolkit/budget-plan',
    '/trainhub/toolkit/procurement',
    '/trainhub/toolkit/trends-report-2026',
    // 分类专题 (9)
    '/trainhub/topics/leadership',
    '/trainhub/topics/sales',
    '/trainhub/topics/digital',
    '/trainhub/topics/hr',
    '/trainhub/topics/finance',
    '/trainhub/topics/communication',
    '/trainhub/topics/project-management',
    '/trainhub/topics/culture',
    '/trainhub/topics/compliance',
    // 培训师详情 (18)
    ...Array.from({ length: 18 }, (_, i) => `/trainhub/trainers/${i + 1}`),
    // 课程详情 (23)
    ...Array.from({ length: 23 }, (_, i) => `/trainhub/courses/${i + 1}`),
    // 博客文章（动态读取）
    ...blogIds.map(id => `/trainhub/blog/${id}`),
    // RSS feed
    '/trainhub/feed.xml',
  ]

  return urls.map(path => `${SITE_URL}${path}`)
}

// IndexNow 支持的搜索引擎 API 端点
const ENGINES = [
  'https://api.indexnow.org/indexnow',  // 通用端点（分发给所有参与者）
]

async function submitBatch(engine, batch) {
  const body = {
    host: 'withpace.github.io',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  }

  try {
    const res = await fetch(engine, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })

    // IndexNow 返回 200 或 202 都表示成功
    if (res.ok || res.status === 202) {
      console.log(`  OK  ${engine} — ${batch.length} URLs submitted (${res.status})`)
      return true
    } else {
      const text = await res.text().catch(() => '')
      console.log(`  WARN ${engine} — ${res.status} ${text.slice(0, 100)}`)
      return false
    }
  } catch (err) {
    console.log(`  FAIL ${engine} — ${err.message}`)
    return false
  }
}

/** 等待 GitHub Pages 部署生效（验证密钥文件可访问） */
async function waitForDeployment(maxRetries = 6, intervalMs = 15000) {
  console.log(`  Waiting for GitHub Pages deployment (key: ${KEY_LOCATION})...`)
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(KEY_LOCATION)
      if (res.ok) {
        const text = await res.text()
        if (text.trim() === KEY) {
          console.log(`  OK  Key file verified (attempt ${i}/${maxRetries})`)
          return true
        }
      }
      console.log(`  ...  Attempt ${i}/${maxRetries}: not ready yet (${res.status})`)
    } catch (err) {
      console.log(`  ...  Attempt ${i}/${maxRetries}: ${err.message}`)
    }
    if (i < maxRetries) await new Promise(r => setTimeout(r, intervalMs))
  }
  console.log('  WARN  Key file not accessible after retries, submitting anyway')
  return false
}

async function main() {
  const urls = buildUrlList()
  console.log(`\n  IndexNow Submission — ${urls.length} URLs\n`)

  // 等待 GitHub Pages 部署生效，避免竞态条件导致 403
  await waitForDeployment()

  // IndexNow 单次最多提交 10000 个 URL，我们远不到上限
  for (const engine of ENGINES) {
    await submitBatch(engine, urls)
  }

  // Google sitemap ping endpoint 已于 2024 年正式废弃（返回 404）
  // Google 收录需通过 Search Console 提交 sitemap
  console.log('  INFO Google sitemap ping — skipped (endpoint deprecated since 2024, use Search Console)')
  console.log(`       Sitemap: ${SITE_URL}/trainhub/sitemap.xml`)
  console.log(`       RSS Feed: ${SITE_URL}/trainhub/feed.xml`)

  console.log('\n  Done.\n')
}

main().catch(console.error)
