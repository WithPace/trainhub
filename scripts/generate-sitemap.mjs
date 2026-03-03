#!/usr/bin/env node
/**
 * generate-sitemap.mjs — 自动生成 sitemap.xml
 *
 * 基于 blog-meta.ts 中的 publishDate 实现差异化 lastmod，
 * 替代手动维护的 632 行静态 sitemap。
 *
 * 用法: node scripts/generate-sitemap.mjs
 * 输出: public/sitemap.xml
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_META_PATH = join(ROOT, 'src/data/blog-meta.ts')
const OUTPUT_PATH = join(ROOT, 'public/sitemap.xml')
const BASE_URL = 'https://withpace.github.io/trainhub'

// 今天日期（YYYY-MM-DD）
const TODAY = new Date().toISOString().split('T')[0]

/**
 * 从 blog-meta.ts 提取文章 id → publishDate 映射
 * 用正则解析 TS 源码，避免依赖 tsx/ts-node
 */
function parseBlogMeta() {
  const source = readFileSync(BLOG_META_PATH, 'utf-8')
  const entries = new Map()

  // 匹配每个 { id: '...', ... publishDate: '...' } 对象
  const idRegex = /id:\s*'([^']+)'/g
  const dateRegex = /publishDate:\s*'([^']+)'/g

  const ids = [...source.matchAll(idRegex)].map(m => m[1])
  const dates = [...source.matchAll(dateRegex)].map(m => m[1])

  // id 和 publishDate 出现顺序一一对应
  for (let i = 0; i < ids.length; i++) {
    entries.set(ids[i], dates[i] || TODAY)
  }

  return entries
}

/** 生成单个 <url> 节点 */
function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

function generateSitemap() {
  const blogMeta = parseBlogMeta()
  const entries = []

  // ── 核心页面 ──
  entries.push(urlEntry(`${BASE_URL}/`, TODAY, 'weekly', '1.0'))
  entries.push(urlEntry(`${BASE_URL}/trainers`, TODAY, 'weekly', '0.8'))
  entries.push(urlEntry(`${BASE_URL}/courses`, TODAY, 'weekly', '0.8'))
  entries.push(urlEntry(`${BASE_URL}/blog`, TODAY, 'weekly', '0.8'))

  // ── 功能页面 ──
  entries.push(urlEntry(`${BASE_URL}/join`, TODAY, 'monthly', '0.7'))
  entries.push(urlEntry(`${BASE_URL}/faq`, TODAY, 'monthly', '0.6'))
  entries.push(urlEntry(`${BASE_URL}/match`, TODAY, 'monthly', '0.8'))
  entries.push(urlEntry(`${BASE_URL}/about`, TODAY, 'monthly', '0.5'))
  entries.push(urlEntry(`${BASE_URL}/assessment`, TODAY, 'monthly', '0.8'))

  // ── 培训师详情 (18) ──
  for (let i = 1; i <= 18; i++) {
    entries.push(urlEntry(`${BASE_URL}/trainers/${i}`, TODAY, 'weekly', '0.6'))
  }

  // ── 课程详情 (23) ──
  for (let i = 1; i <= 23; i++) {
    entries.push(urlEntry(`${BASE_URL}/courses/${i}`, TODAY, 'weekly', '0.6'))
  }

  // ── 分类专题 (9) ──
  const topics = ['leadership', 'sales', 'digital', 'hr', 'finance', 'communication', 'project-management', 'culture', 'compliance']
  for (const topic of topics) {
    entries.push(urlEntry(`${BASE_URL}/topics/${topic}`, TODAY, 'weekly', '0.8'))
  }

  // ── 博客文章（基于 publishDate 差异化 lastmod） ──
  for (const [id, publishDate] of blogMeta) {
    entries.push(urlEntry(`${BASE_URL}/blog/${id}`, publishDate, 'monthly', '0.7'))
  }

  // ── 免费工具 (2) ──
  entries.push(urlEntry(`${BASE_URL}/tools/budget-calculator`, TODAY, 'monthly', '0.8'))
  entries.push(urlEntry(`${BASE_URL}/tools/roi-calculator`, TODAY, 'monthly', '0.8'))

  // ── 付费工具包 ──
  entries.push(urlEntry(`${BASE_URL}/toolkit`, TODAY, 'weekly', '0.9'))
  // ── 工具包模板详情 (6) ──
  const toolkitSlugs = ['needs-analysis', 'annual-plan', 'effectiveness-eval', 'budget-plan', 'procurement', 'trends-report-2026']
  for (const slug of toolkitSlugs) {
    entries.push(urlEntry(`${BASE_URL}/toolkit/${slug}`, TODAY, 'weekly', '0.8'))
  }

  // 组装完整 XML
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '', // 末尾换行
  ].join('\n')

  writeFileSync(OUTPUT_PATH, xml, 'utf-8')

  const totalUrls = entries.length
  const blogUrls = blogMeta.size
  console.log(`  Sitemap generated: ${totalUrls} URLs (${blogUrls} blog posts with individual lastmod)`)
  console.log(`  Output: ${OUTPUT_PATH}`)
}

generateSitemap()
