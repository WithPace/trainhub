#!/usr/bin/env node
/**
 * generate-blog-og-images.mjs
 *
 * 构建时为每篇博客文章生成个性化 og:image PNG（1200×630）。
 * 每篇文章一张独立卡片：品牌渐变背景 + 文章标题 + 分类标签 + 阅读时间。
 *
 * 输出: public/og/blog/{slug}.webp
 * 用法: node scripts/generate-blog-og-images.mjs
 */

import { readFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const BLOG_META_PATH = resolve(ROOT, 'src/data/blog-meta.ts')
const OUTPUT_DIR = resolve(ROOT, 'public/og/blog')

const WIDTH = 1200
const HEIGHT = 630
const PADDING_X = 80
const USABLE_WIDTH = WIDTH - PADDING_X * 2

// 分类→徽章颜色
const CATEGORY_COLORS = {
  '行业洞察': '#f59e0b',
  'AI与数字化': '#8b5cf6',
  '领导力': '#ef4444',
  '培训采购': '#10b981',
  '培训管理': '#3b82f6',
  '培训师成长': '#f97316',
  '实操指南': '#06b6d4',
  '课程推荐': '#ec4899',
  '采购指南': '#14b8a6',
  '行业方案': '#6366f1',
}

const FONT_FAMILY =
  "system-ui, -apple-system, 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"

// ── 解析 blog-meta.ts ─────────────────────────────────────────
// 与 generate-sitemap.mjs 同策略：正则提取，无需 tsx/ts-node

function parseBlogMeta() {
  const source = readFileSync(BLOG_META_PATH, 'utf-8')

  // 匹配每个对象块 { ... }
  const blockRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?readTime:\s*'([^']+)'/g
  const posts = []

  let m
  while ((m = blockRegex.exec(source)) !== null) {
    posts.push({
      id: m[1],
      title: m[2],
      category: m[3],
      readTime: m[4],
    })
  }

  return posts
}

// ── 文本工具 ───────────────────────────────────────────────────

/** 估算文本渲染宽度（px），中文字符按 1em，ASCII 按 0.55em */
function estimateWidth(text, fontSize) {
  let w = 0
  for (const ch of text) {
    w += ch.charCodeAt(0) > 127 ? fontSize : fontSize * 0.55
  }
  return w
}

/** XML 特殊字符转义 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 将标题文本按像素宽度折行
 * @returns {{ lines: string[], fontSize: number }}
 */
function wrapTitle(title) {
  // 尝试不同字号：优先大字
  const candidates = [
    { fontSize: 52, maxLines: 2 },
    { fontSize: 46, maxLines: 3 },
    { fontSize: 40, maxLines: 3 },
  ]

  for (const { fontSize, maxLines } of candidates) {
    const lines = breakLines(title, fontSize, USABLE_WIDTH)
    if (lines.length <= maxLines) {
      return { lines, fontSize }
    }
  }

  // 兜底：40px，截断到 3 行
  const lines = breakLines(title, 40, USABLE_WIDTH).slice(0, 3)
  // 最后一行截断加省略号
  const last = lines[lines.length - 1]
  if (breakLines(title, 40, USABLE_WIDTH).length > 3) {
    lines[lines.length - 1] = last.slice(0, -1) + '…'
  }
  return { lines, fontSize: 40 }
}

/** 按像素宽度拆行，优先在中文标点后断行 */
function breakLines(text, fontSize, maxWidth) {
  const lines = []
  let start = 0

  while (start < text.length) {
    let end = start
    let lastBreakable = start

    while (end < text.length) {
      end++
      const lineWidth = estimateWidth(text.slice(start, end), fontSize)
      // 记录可断行位置：中文标点后
      const ch = text[end - 1]
      if ('，。、；：！？）》」』】'.includes(ch)) {
        lastBreakable = end
      }
      if (lineWidth > maxWidth) {
        end--
        break
      }
    }

    if (end >= text.length) {
      lines.push(text.slice(start))
      break
    }

    // 优先在标点后断行
    if (lastBreakable > start) {
      lines.push(text.slice(start, lastBreakable))
      start = lastBreakable
    } else {
      lines.push(text.slice(start, end))
      start = end
    }
  }

  return lines
}

// ── SVG 生成 ───────────────────────────────────────────────────

function generateSvg({ title, category, readTime }) {
  const catColor = CATEGORY_COLORS[category] || '#3b82f6'
  const { lines, fontSize } = wrapTitle(title)
  const lineHeight = Math.round(fontSize * 1.45)

  // 标题垂直居中（在 160px ~ 460px 区域内）
  const titleAreaTop = 170
  const titleAreaHeight = 300
  const titleBlockHeight = lines.length * lineHeight
  const titleStartY =
    titleAreaTop + Math.round((titleAreaHeight - titleBlockHeight) / 2) + fontSize

  const titleElements = lines
    .map(
      (line, i) =>
        `<text x="${PADDING_X}" y="${titleStartY + i * lineHeight}" ` +
        `font-family="${FONT_FAMILY}" font-size="${fontSize}" font-weight="bold" ` +
        `fill="white">${escapeXml(line)}</text>`
    )
    .join('\n  ')

  // 分类徽章宽度估算
  const badgeTextWidth = estimateWidth(category, 16)
  const badgeWidth = badgeTextWidth + 32

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- 装饰圆 -->
  <circle cx="1050" cy="80" r="180" fill="#3b82f6" opacity="0.15"/>
  <circle cx="150" cy="580" r="220" fill="#6366f1" opacity="0.12"/>
  <circle cx="1150" cy="500" r="100" fill="#818cf8" opacity="0.10"/>

  <!-- 分类标签 -->
  <rect x="${PADDING_X}" y="90" width="${badgeWidth}" height="34" rx="17" fill="${catColor}" opacity="0.9"/>
  <text x="${PADDING_X + badgeWidth / 2}" y="112" font-family="${FONT_FAMILY}" font-size="15" font-weight="600" fill="white" text-anchor="middle">${escapeXml(category)}</text>

  <!-- 阅读时间 -->
  <text x="${PADDING_X + badgeWidth + 16}" y="112" font-family="${FONT_FAMILY}" font-size="15" fill="#93c5fd">${escapeXml(readTime)}阅读</text>

  <!-- 标题 -->
  ${titleElements}

  <!-- 底部分隔线 -->
  <line x1="${PADDING_X}" y1="520" x2="360" y2="520" stroke="#60a5fa" stroke-width="2" opacity="0.4"/>

  <!-- 品牌 -->
  <text x="${PADDING_X}" y="568" font-family="${FONT_FAMILY}" font-size="28" font-weight="bold" fill="white" opacity="0.9">TrainHub</text>
  <text x="232" y="568" font-family="${FONT_FAMILY}" font-size="17" fill="#93c5fd">企业培训师技能市场</text>
</svg>`
}

// ── 主流程 ─────────────────────────────────────────────────────

async function main() {
  const posts = parseBlogMeta()
  if (posts.length === 0) {
    console.error('[blog-og] 未从 blog-meta.ts 中解析到任何文章')
    process.exit(1)
  }

  // 确保输出目录存在
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log(`[blog-og] 为 ${posts.length} 篇博客文章生成个性化 og:image…`)

  let generated = 0
  let skipped = 0

  for (const post of posts) {
    const outPath = resolve(OUTPUT_DIR, `${post.id}.webp`)

    // 增量生成：跳过已存在的图片（开发时可删除 public/og/blog/ 强制重新生成）
    if (existsSync(outPath)) {
      skipped++
      continue
    }

    const svg = generateSvg(post)

    await sharp(Buffer.from(svg))
      .resize(WIDTH, HEIGHT)
      .webp({ quality: 85, effort: 6 })
      .toFile(outPath)

    generated++
  }

  console.log(
    `[blog-og] 完成: ${generated} 张新生成, ${skipped} 张已存在跳过, 共 ${posts.length} 篇文章`
  )
  console.log(`[blog-og] 输出目录: ${OUTPUT_DIR}`)
}

main().catch((err) => {
  console.error('[blog-og] 生成失败:', err)
  process.exit(1)
})
