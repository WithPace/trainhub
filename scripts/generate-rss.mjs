#!/usr/bin/env node
/**
 * generate-rss.mjs — 自动生成 RSS 2.0 feed
 *
 * 从 blog-meta.ts 提取文章元数据，生成标准 RSS feed。
 * 帮助搜索引擎发现内容，支持 RSS 阅读器订阅。
 *
 * 用法: node scripts/generate-rss.mjs
 * 输出: public/feed.xml
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_META_PATH = join(ROOT, 'src/data/blog-meta.ts')
const OUTPUT_PATH = join(ROOT, 'public/feed.xml')
const BASE_URL = 'https://withpace.github.io/trainhub'
const SITE_TITLE = 'TrainHub - 企业培训行业洞察'
const SITE_DESCRIPTION = '企业培训师选择、培训管理、行业趋势等专业内容，助力 HR 和培训经理做出更好的培训决策。'

/**
 * 从 blog-meta.ts 提取文章元数据
 * 用正则解析 TS 源码，避免依赖 tsx/ts-node
 */
function parseBlogMeta() {
  const source = readFileSync(BLOG_META_PATH, 'utf-8')

  // 匹配每个文章对象块 { id: '...', ... }
  const blockRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?readTime:\s*'[^']+'\s*,?\s*\}/g
  const articles = []

  for (const block of source.matchAll(blockRegex)) {
    const text = block[0]
    const id = block[1]

    const titleMatch = text.match(/title:\s*'([^']*(?:\\.[^']*)*)'/)
    const excerptMatch = text.match(/excerpt:\s*'([^']*(?:\\.[^']*)*)'/)
    const dateMatch = text.match(/publishDate:\s*'([^']+)'/)
    const categoryMatch = text.match(/category:\s*'([^']+)'/)
    const authorMatch = text.match(/author:\s*'([^']+)'/)

    if (id && titleMatch && dateMatch) {
      articles.push({
        id,
        title: titleMatch[1],
        excerpt: excerptMatch ? excerptMatch[1] : '',
        publishDate: dateMatch[1],
        category: categoryMatch ? categoryMatch[1] : '',
        author: authorMatch ? authorMatch[1] : 'TrainHub',
      })
    }
  }

  // 按发布日期降序排列（最新在前）
  articles.sort((a, b) => b.publishDate.localeCompare(a.publishDate))

  return articles
}

/** XML 特殊字符转义 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** ISO 日期转 RFC 822 格式（RSS 标准） */
function toRFC822(isoDate) {
  const date = new Date(isoDate + 'T08:00:00+08:00') // 假设北京时间
  return date.toUTCString()
}

function generateRSS() {
  const articles = parseBlogMeta()

  const items = articles.map(article => {
    const link = `${BASE_URL}/blog/${article.id}`
    return [
      '    <item>',
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <description>${escapeXml(article.excerpt)}</description>`,
      `      <pubDate>${toRFC822(article.publishDate)}</pubDate>`,
      `      <category>${escapeXml(article.category)}</category>`,
      `      <author>${escapeXml(article.author)}</author>`,
      '    </item>',
    ].join('\n')
  })

  const buildDate = new Date().toUTCString()

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE_TITLE)}</title>`,
    `    <link>${BASE_URL}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    '    <language>zh-cn</language>',
    `    <lastBuildDate>${buildDate}</lastBuildDate>`,
    `    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`,
    `    <image>`,
    `      <url>${BASE_URL}/og-image.webp</url>`,
    `      <title>${escapeXml(SITE_TITLE)}</title>`,
    `      <link>${BASE_URL}</link>`,
    `    </image>`,
    ...items,
    '  </channel>',
    '</rss>',
    '', // 末尾换行
  ].join('\n')

  writeFileSync(OUTPUT_PATH, rss, 'utf-8')

  console.log(`  RSS feed generated: ${articles.length} articles`)
  console.log(`  Output: ${OUTPUT_PATH}`)
}

generateRSS()
