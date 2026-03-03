/**
 * generate-og-image.mjs
 *
 * 构建时将 public/og-image.svg 转换为 public/og-image.png
 * 使用 sharp —— Node.js 最成熟的图片处理库
 *
 * 用法: node scripts/generate-og-image.mjs
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SVG_PATH = resolve(ROOT, 'public/og-image.svg')
const PNG_PATH = resolve(ROOT, 'public/og-image.png')

const WIDTH = 1200
const HEIGHT = 630
const PNG_QUALITY = 90

async function main() {
  if (!existsSync(SVG_PATH)) {
    console.error(`[og-image] SVG 源文件不存在: ${SVG_PATH}`)
    process.exit(1)
  }

  const svgBuffer = readFileSync(SVG_PATH)

  await sharp(svgBuffer)
    .resize(WIDTH, HEIGHT)
    .png({ quality: PNG_QUALITY, compressionLevel: 6 })
    .toFile(PNG_PATH)

  console.log(`[og-image] PNG 已生成: ${PNG_PATH}`)
}

main().catch((err) => {
  console.error('[og-image] 生成失败:', err)
  process.exit(1)
})
