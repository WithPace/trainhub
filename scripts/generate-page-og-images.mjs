#!/usr/bin/env node
/**
 * generate-page-og-images.mjs
 *
 * 构建时为培训师和课程详情页生成个性化 og:image PNG（1200×630）。
 * - 培训师: 绿色渐变背景 + 姓名 + 头衔 + 专长 + 城市/经验
 * - 课程: 紫色渐变背景 + 课程标题 + 分类 + 时长/人数 + 价格
 *
 * 输出: public/og/trainers/{id}.png, public/og/courses/{id}.png
 * 用法: node scripts/generate-page-og-images.mjs
 */

import { readFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MOCK_PATH = resolve(ROOT, 'src/data/mock.ts')
const TRAINER_DIR = resolve(ROOT, 'public/og/trainers')
const COURSE_DIR = resolve(ROOT, 'public/og/courses')

const WIDTH = 1200
const HEIGHT = 630
const PADDING_X = 80
const USABLE_WIDTH = WIDTH - PADDING_X * 2

const FONT_FAMILY =
  "system-ui, -apple-system, 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"

// ── 解析 mock.ts ─────────────────────────────────────────────

function parseMockData() {
  const source = readFileSync(MOCK_PATH, 'utf-8')

  // 解析培训师（字段顺序：id → name → title → years_experience → specialties → city）
  const trainerRegex =
    /\{\s*id:\s*(\d+),\s*\n\s*name:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?years_experience:\s*(\d+)[\s\S]*?specialties:\s*\[([^\]]*)\][\s\S]*?city:\s*'([^']+)'/g
  const trainers = []
  let m
  while ((m = trainerRegex.exec(source)) !== null) {
    trainers.push({
      id: parseInt(m[1]),
      name: m[2],
      title: m[3],
      years: parseInt(m[4]),
      specialties: m[5].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) ?? [],
      city: m[6],
    })
  }

  // 解析课程
  const courseRegex =
    /\{\s*id:\s*(\d+),\s*trainer_id:\s*\d+[\s\S]*?title:\s*'([^']+)'[\s\S]*?duration:\s*'([^']+)'[\s\S]*?max_participants:\s*(\d+)[\s\S]*?price_range:\s*'([^']+)'[\s\S]*?category_name:\s*'([^']+)'/g
  const courses = []
  while ((m = courseRegex.exec(source)) !== null) {
    courses.push({
      id: parseInt(m[1]),
      title: m[2],
      duration: m[3],
      maxParticipants: parseInt(m[4]),
      priceRange: m[5],
      category: m[6],
    })
  }

  return { trainers, courses }
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

/** 按像素宽度拆行 */
function breakLines(text, fontSize, maxWidth) {
  const lines = []
  let start = 0

  while (start < text.length) {
    let end = start
    let lastBreakable = start

    while (end < text.length) {
      end++
      const lineWidth = estimateWidth(text.slice(start, end), fontSize)
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

/** 将标题文本按像素宽度折行，返回 { lines, fontSize } */
function wrapTitle(title, maxWidth = USABLE_WIDTH) {
  const candidates = [
    { fontSize: 52, maxLines: 2 },
    { fontSize: 46, maxLines: 3 },
    { fontSize: 40, maxLines: 3 },
  ]

  for (const { fontSize, maxLines } of candidates) {
    const lines = breakLines(title, fontSize, maxWidth)
    if (lines.length <= maxLines) {
      return { lines, fontSize }
    }
  }

  const lines = breakLines(title, 40, maxWidth).slice(0, 3)
  if (breakLines(title, 40, maxWidth).length > 3) {
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1) + '…'
  }
  return { lines, fontSize: 40 }
}

// ── SVG 生成 ───────────────────────────────────────────────────

/** 培训师 og:image SVG */
function generateTrainerSvg(trainer) {
  const { lines: nameLines, fontSize: nameFontSize } = wrapTitle(trainer.name, USABLE_WIDTH)
  const nameLineHeight = Math.round(nameFontSize * 1.4)

  // 专长标签
  const specialtyTags = trainer.specialties.slice(0, 4)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#065f46;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- 装饰圆 -->
  <circle cx="1050" cy="80" r="180" fill="#10b981" opacity="0.15"/>
  <circle cx="150" cy="580" r="220" fill="#34d399" opacity="0.12"/>
  <circle cx="1150" cy="500" r="100" fill="#6ee7b7" opacity="0.10"/>

  <!-- 头衔标签 -->
  <rect x="${PADDING_X}" y="80" width="${estimateWidth(trainer.title, 16) + 32}" height="34" rx="17" fill="#10b981" opacity="0.9"/>
  <text x="${PADDING_X + (estimateWidth(trainer.title, 16) + 32) / 2}" y="102" font-family="${FONT_FAMILY}" font-size="15" font-weight="600" fill="white" text-anchor="middle">${escapeXml(trainer.title)}</text>

  <!-- 姓名 -->
  ${nameLines
    .map(
      (line, i) =>
        `<text x="${PADDING_X}" y="${200 + i * nameLineHeight}" font-family="${FONT_FAMILY}" font-size="${nameFontSize}" font-weight="bold" fill="white">${escapeXml(line)}</text>`
    )
    .join('\n  ')}

  <!-- 城市 + 经验 -->
  <text x="${PADDING_X}" y="310" font-family="${FONT_FAMILY}" font-size="22" fill="#a7f3d0">${escapeXml(trainer.city)} · ${trainer.years}年培训经验</text>

  <!-- 专长标签 -->
  ${(() => {
    let x = PADDING_X
    return specialtyTags
      .map((tag) => {
        const tagWidth = estimateWidth(tag, 16) + 28
        const el = `<rect x="${x}" y="350" width="${tagWidth}" height="32" rx="16" fill="white" opacity="0.15"/>
  <text x="${x + tagWidth / 2}" y="371" font-family="${FONT_FAMILY}" font-size="15" fill="#d1fae5" text-anchor="middle">${escapeXml(tag)}</text>`
        x += tagWidth + 12
        return el
      })
      .join('\n  ')
  })()}

  <!-- 底部分隔线 -->
  <line x1="${PADDING_X}" y1="520" x2="360" y2="520" stroke="#34d399" stroke-width="2" opacity="0.4"/>

  <!-- 品牌 -->
  <text x="${PADDING_X}" y="568" font-family="${FONT_FAMILY}" font-size="28" font-weight="bold" fill="white" opacity="0.9">TrainHub</text>
  <text x="232" y="568" font-family="${FONT_FAMILY}" font-size="17" fill="#a7f3d0">企业培训师技能市场</text>
</svg>`
}

/** 课程 og:image SVG */
function generateCourseSvg(course) {
  const { lines: titleLines, fontSize: titleFontSize } = wrapTitle(course.title)
  const titleLineHeight = Math.round(titleFontSize * 1.45)

  // 标题垂直居中区域
  const titleAreaTop = 160
  const titleAreaHeight = 260
  const titleBlockHeight = titleLines.length * titleLineHeight
  const titleStartY =
    titleAreaTop + Math.round((titleAreaHeight - titleBlockHeight) / 2) + titleFontSize

  // 分类徽章
  const catBadgeWidth = estimateWidth(course.category, 16) + 32

  // 价格格式化
  const [lowPrice, highPrice] = course.priceRange.split('-')
  const low = Math.round(parseInt(lowPrice) / 10000)
  const high = Math.round(parseInt(highPrice) / 10000)
  const priceText = low === high ? `${low}万/场` : `${low}-${high}万/场`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5b21b6;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- 装饰圆 -->
  <circle cx="1050" cy="80" r="180" fill="#8b5cf6" opacity="0.15"/>
  <circle cx="150" cy="580" r="220" fill="#a78bfa" opacity="0.12"/>
  <circle cx="1150" cy="500" r="100" fill="#c4b5fd" opacity="0.10"/>

  <!-- 分类标签 -->
  <rect x="${PADDING_X}" y="80" width="${catBadgeWidth}" height="34" rx="17" fill="#8b5cf6" opacity="0.9"/>
  <text x="${PADDING_X + catBadgeWidth / 2}" y="102" font-family="${FONT_FAMILY}" font-size="15" font-weight="600" fill="white" text-anchor="middle">${escapeXml(course.category)}</text>

  <!-- 时长 + 人数 -->
  <text x="${PADDING_X + catBadgeWidth + 16}" y="102" font-family="${FONT_FAMILY}" font-size="15" fill="#c4b5fd">${escapeXml(course.duration)} · 最多${course.maxParticipants}人</text>

  <!-- 课程标题 -->
  ${titleLines
    .map(
      (line, i) =>
        `<text x="${PADDING_X}" y="${titleStartY + i * titleLineHeight}" font-family="${FONT_FAMILY}" font-size="${titleFontSize}" font-weight="bold" fill="white">${escapeXml(line)}</text>`
    )
    .join('\n  ')}

  <!-- 价格 -->
  <text x="${PADDING_X}" y="470" font-family="${FONT_FAMILY}" font-size="26" font-weight="bold" fill="#ddd6fe">${escapeXml(priceText)}</text>

  <!-- 底部分隔线 -->
  <line x1="${PADDING_X}" y1="520" x2="360" y2="520" stroke="#a78bfa" stroke-width="2" opacity="0.4"/>

  <!-- 品牌 -->
  <text x="${PADDING_X}" y="568" font-family="${FONT_FAMILY}" font-size="28" font-weight="bold" fill="white" opacity="0.9">TrainHub</text>
  <text x="232" y="568" font-family="${FONT_FAMILY}" font-size="17" fill="#c4b5fd">企业培训师技能市场</text>
</svg>`
}

// ── 主流程 ─────────────────────────────────────────────────────

async function main() {
  const { trainers, courses } = parseMockData()

  if (trainers.length === 0 || courses.length === 0) {
    console.error('[page-og] 未从 mock.ts 中解析到培训师或课程数据')
    process.exit(1)
  }

  // 确保输出目录存在
  for (const dir of [TRAINER_DIR, COURSE_DIR]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  }

  console.log(`[page-og] 为 ${trainers.length} 位培训师 + ${courses.length} 门课程生成 og:image…`)

  let generated = 0
  let skipped = 0

  // 生成培训师 og:images
  for (const trainer of trainers) {
    const outPath = resolve(TRAINER_DIR, `${trainer.id}.png`)
    if (existsSync(outPath)) {
      skipped++
      continue
    }

    const svg = generateTrainerSvg(trainer)
    await sharp(Buffer.from(svg))
      .resize(WIDTH, HEIGHT)
      .png({ compressionLevel: 6 })
      .toFile(outPath)
    generated++
  }

  // 生成课程 og:images
  for (const course of courses) {
    const outPath = resolve(COURSE_DIR, `${course.id}.png`)
    if (existsSync(outPath)) {
      skipped++
      continue
    }

    const svg = generateCourseSvg(course)
    await sharp(Buffer.from(svg))
      .resize(WIDTH, HEIGHT)
      .png({ compressionLevel: 6 })
      .toFile(outPath)
    generated++
  }

  console.log(
    `[page-og] 完成: ${generated} 张新生成, ${skipped} 张已存在跳过, 共 ${trainers.length + courses.length} 个页面`
  )
  console.log(`[page-og] 输出目录: ${TRAINER_DIR}, ${COURSE_DIR}`)
}

main().catch((err) => {
  console.error('[page-og] 生成失败:', err)
  process.exit(1)
})
