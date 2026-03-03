#!/usr/bin/env node
/**
 * generate-toolkit-og-images.mjs
 *
 * 为 6 个工具包模板详情页生成 og:image WebP（1200×630）。
 * 每个模板一张独立卡片：品牌渐变背景 + 模板标题 + 免费标签。
 *
 * 输出: public/og/toolkit/{slug}.webp
 * 用法: node scripts/generate-toolkit-og-images.mjs
 */

import { mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUTPUT_DIR = resolve(ROOT, 'public/og/toolkit')

const WIDTH = 1200
const HEIGHT = 630
const PADDING_X = 80
const USABLE_WIDTH = WIDTH - PADDING_X * 2

const FONT_FAMILY =
  "system-ui, -apple-system, 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"

// 工具包模板元数据
const TOOLKIT_TEMPLATES = [
  {
    slug: 'landing',
    title: '企业培训决策工具包',
    subtitle: '6 合 1 专业模板 + 行业报告 · 免费领取',
    icon: 'package',
    color: '#22c55e',
  },
  {
    slug: 'needs-analysis',
    title: '培训需求分析模板',
    subtitle: '系统化诊断企业培训需求，找准投入方向',
    icon: 'clipboard-list',
    color: '#3b82f6',
  },
  {
    slug: 'annual-plan',
    title: '年度培训计划模板',
    subtitle: '一张表规划全年培训，预算、排期、KPI 一步到位',
    icon: 'file-text',
    color: '#8b5cf6',
  },
  {
    slug: 'effectiveness-eval',
    title: '培训效果评估工具',
    subtitle: '基于柯氏四级模型，量化培训价值与 ROI',
    icon: 'bar-chart-3',
    color: '#ef4444',
  },
  {
    slug: 'budget-plan',
    title: '培训预算规划表',
    subtitle: '分行业基准数据 + 自动计算逻辑，让预算有据可依',
    icon: 'calculator',
    color: '#f59e0b',
  },
  {
    slug: 'procurement',
    title: '培训招标/比价模板',
    subtitle: '标准化的供应商评估矩阵 + 招标文件框架',
    icon: 'file-search',
    color: '#10b981',
  },
  {
    slug: 'trends-report-2026',
    title: '2026 企业培训趋势报告',
    subtitle: '覆盖 9 大热门领域的趋势分析 + 行动建议',
    icon: 'trending-up',
    color: '#06b6d4',
  },
]

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

// ── SVG 生成 ───────────────────────────────────────────────────

function generateSvg({ title, subtitle, color }) {
  const titleFontSize = 48
  const subtitleFontSize = 22

  // 免费标签
  const badgeText = '免费领取'
  const badgeWidth = estimateWidth(badgeText, 16) + 32

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
  <circle cx="1050" cy="80" r="180" fill="${color}" opacity="0.15"/>
  <circle cx="150" cy="580" r="220" fill="#6366f1" opacity="0.12"/>
  <circle cx="1150" cy="500" r="100" fill="${color}" opacity="0.10"/>

  <!-- 分类标签 -->
  <rect x="${PADDING_X}" y="100" width="180" height="34" rx="17" fill="#22c55e" opacity="0.9"/>
  <text x="${PADDING_X + 90}" y="122" font-family="${FONT_FAMILY}" font-size="15" font-weight="600" fill="white" text-anchor="middle">企业培训工具包</text>

  <!-- 免费标签 -->
  <rect x="${PADDING_X + 192}" y="100" width="${badgeWidth}" height="34" rx="17" fill="${color}" opacity="0.9"/>
  <text x="${PADDING_X + 192 + badgeWidth / 2}" y="122" font-family="${FONT_FAMILY}" font-size="15" font-weight="600" fill="white" text-anchor="middle">${escapeXml(badgeText)}</text>

  <!-- 标题 -->
  <text x="${PADDING_X}" y="260" font-family="${FONT_FAMILY}" font-size="${titleFontSize}" font-weight="bold" fill="white">${escapeXml(title)}</text>

  <!-- 副标题 -->
  <text x="${PADDING_X}" y="320" font-family="${FONT_FAMILY}" font-size="${subtitleFontSize}" fill="#93c5fd">${escapeXml(subtitle)}</text>

  <!-- 特色标签 -->
  <rect x="${PADDING_X}" y="380" width="120" height="32" rx="6" fill="white" opacity="0.15"/>
  <text x="${PADDING_X + 60}" y="402" font-family="${FONT_FAMILY}" font-size="14" fill="white" opacity="0.8" text-anchor="middle">在线使用</text>

  <rect x="${PADDING_X + 136}" y="380" width="120" height="32" rx="6" fill="white" opacity="0.15"/>
  <text x="${PADDING_X + 196}" y="402" font-family="${FONT_FAMILY}" font-size="14" fill="white" opacity="0.8" text-anchor="middle">可打印</text>

  <rect x="${PADDING_X + 272}" y="380" width="120" height="32" rx="6" fill="white" opacity="0.15"/>
  <text x="${PADDING_X + 332}" y="402" font-family="${FONT_FAMILY}" font-size="14" fill="white" opacity="0.8" text-anchor="middle">专业模板</text>

  <!-- 底部分隔线 -->
  <line x1="${PADDING_X}" y1="500" x2="360" y2="500" stroke="#60a5fa" stroke-width="2" opacity="0.4"/>

  <!-- 品牌 -->
  <text x="${PADDING_X}" y="548" font-family="${FONT_FAMILY}" font-size="28" font-weight="bold" fill="white" opacity="0.9">TrainHub</text>
  <text x="232" y="548" font-family="${FONT_FAMILY}" font-size="17" fill="#93c5fd">企业培训师技能市场</text>
</svg>`
}

// ── 主流程 ─────────────────────────────────────────────────────

async function main() {
  // 确保输出目录存在
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log(`[toolkit-og] 为 ${TOOLKIT_TEMPLATES.length} 个工具包模板生成 og:image…`)

  let generated = 0
  let skipped = 0

  for (const template of TOOLKIT_TEMPLATES) {
    const outPath = resolve(OUTPUT_DIR, `${template.slug}.webp`)

    // 增量生成：跳过已存在的图片
    if (existsSync(outPath)) {
      skipped++
      continue
    }

    const svg = generateSvg(template)

    await sharp(Buffer.from(svg))
      .resize(WIDTH, HEIGHT)
      .webp({ quality: 85, effort: 6 })
      .toFile(outPath)

    generated++
  }

  console.log(
    `[toolkit-og] 完成: ${generated} 张新生成, ${skipped} 张已存在跳过, 共 ${TOOLKIT_TEMPLATES.length} 个模板`
  )
  console.log(`[toolkit-og] 输出目录: ${OUTPUT_DIR}`)
}

main().catch((err) => {
  console.error('[toolkit-og] 生成失败:', err)
  process.exit(1)
})
