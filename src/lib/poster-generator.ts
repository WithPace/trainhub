/**
 * 自评结果海报图片生成器
 * 使用 Canvas API 渲染品牌海报，用于社交媒体分享
 * 尺寸 750×1334 (微信朋友圈标准比例)
 */

interface DimensionData {
  name: string
  score: number
  level: string
  levelLabel: string
}

interface PosterData {
  overallScore: number
  overallLevel: string
  overallLevelLabel: string
  overallComment: string
  dimensions: DimensionData[]
  shareUrl: string
}

/** 等级对应的渐变色 */
function getLevelGradient(level: string): [string, string] {
  switch (level) {
    case 'A': return ['#22c55e', '#16a34a']
    case 'B': return ['#3b82f6', '#2563eb']
    case 'C': return ['#f59e0b', '#d97706']
    case 'D': return ['#ef4444', '#dc2626']
    default: return ['#6b7280', '#4b5563']
  }
}

/** 等级对应的浅色背景 */
function getLevelBg(level: string): string {
  switch (level) {
    case 'A': return '#f0fdf4'
    case 'B': return '#eff6ff'
    case 'C': return '#fffbeb'
    case 'D': return '#fef2f2'
    default: return '#f9fafb'
  }
}

/** 圆角矩形路径 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** 绘制进度条 */
function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  progress: number,
  colors: [string, string],
) {
  // 背景
  roundRect(ctx, x, y, w, h, h / 2)
  ctx.fillStyle = '#f3f4f6'
  ctx.fill()

  // 进度
  const pw = Math.max(h, w * progress)
  roundRect(ctx, x, y, pw, h, h / 2)
  const grad = ctx.createLinearGradient(x, y, x + pw, y)
  grad.addColorStop(0, colors[0])
  grad.addColorStop(1, colors[1])
  ctx.fillStyle = grad
  ctx.fill()
}

/** 生成海报并返回 Blob URL */
export async function generatePoster(data: PosterData): Promise<string> {
  const W = 750
  const H = 1334
  const PAD = 48

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── 背景 ──
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // ── Header 渐变条 ──
  const headerH = 260
  const headerGrad = ctx.createLinearGradient(0, 0, W, headerH)
  headerGrad.addColorStop(0, '#2563eb')
  headerGrad.addColorStop(1, '#4f46e5')
  ctx.fillStyle = headerGrad
  ctx.fillRect(0, 0, W, headerH)

  // 品牌名
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = 'bold 28px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('TrainHub 企业培训师技能市场', PAD, 52)

  // 标题
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('企业培训需求诊断报告', PAD, 130)

  // 副标题
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('基于4大能力维度的专业评估', PAD, 180)

  // 日期
  const now = new Date()
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(dateStr, W - PAD, 52)
  ctx.textAlign = 'left'

  // ── 总评卡片 ──
  const cardY = headerH - 40
  const cardH = 180
  const cardMargin = 32
  const cardW = W - cardMargin * 2

  // 卡片阴影
  ctx.shadowColor = 'rgba(0,0,0,0.08)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 4
  roundRect(ctx, cardMargin, cardY, cardW, cardH, 20)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.shadowColor = 'transparent'

  // 等级徽章
  const badgeSize = 90
  const badgeX = cardMargin + 36
  const badgeY = cardY + (cardH - badgeSize) / 2
  const [c1, c2] = getLevelGradient(data.overallLevel)
  const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize)
  badgeGrad.addColorStop(0, c1)
  badgeGrad.addColorStop(1, c2)
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 20)
  ctx.fillStyle = badgeGrad
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(data.overallLevel, badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 18)
  ctx.textAlign = 'left'

  // 总评文字
  const textX = badgeX + badgeSize + 28
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 32px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(`综合评级：${data.overallLevelLabel}`, textX, cardY + 65)

  ctx.fillStyle = '#6b7280'
  ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(`${data.overallScore} / 5.0 分`, textX, cardY + 110)

  // ── 维度详情 ──
  let yPos = cardY + cardH + 48

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 30px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('各维度诊断结果', PAD, yPos)
  yPos += 40

  for (const dim of data.dimensions) {
    const rowH = 120
    const [dc1, dc2] = getLevelGradient(dim.level)

    // 维度背景条
    roundRect(ctx, PAD, yPos, W - PAD * 2, rowH, 16)
    ctx.fillStyle = getLevelBg(dim.level)
    ctx.fill()

    // 维度名称
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 26px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.fillText(dim.name, PAD + 20, yPos + 38)

    // 等级标签
    const labelText = `${dim.level} ${dim.levelLabel}`
    ctx.font = 'bold 22px "PingFang SC", "Microsoft YaHei", sans-serif'
    const labelW = ctx.measureText(labelText).width + 24
    roundRect(ctx, W - PAD - 20 - labelW, yPos + 16, labelW, 34, 17)
    ctx.fillStyle = dc1
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(labelText, W - PAD - 20 - labelW / 2, yPos + 40)
    ctx.textAlign = 'left'

    // 分数
    ctx.fillStyle = '#6b7280'
    ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.fillText(`${dim.score} / 5.0`, PAD + 20, yPos + 72)

    // 进度条
    drawProgressBar(ctx, PAD + 150, yPos + 60, W - PAD * 2 - 170, 16, dim.score / 5, [dc1, dc2])

    yPos += rowH + 12
  }

  // ── 总评评语 ──
  yPos += 16
  roundRect(ctx, PAD, yPos, W - PAD * 2, 120, 16)
  ctx.fillStyle = '#f0f9ff'
  ctx.fill()
  roundRect(ctx, PAD, yPos, 6, 120, 3)
  ctx.fillStyle = '#3b82f6'
  ctx.fill()

  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 22px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('诊断建议', PAD + 24, yPos + 36)

  // 自动换行绘制评语
  ctx.fillStyle = '#374151'
  ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif'
  const maxTextW = W - PAD * 2 - 48
  const words = data.overallComment.split('')
  let line = ''
  let lineY = yPos + 68
  for (const char of words) {
    const testLine = line + char
    if (ctx.measureText(testLine).width > maxTextW) {
      ctx.fillText(line, PAD + 24, lineY)
      line = char
      lineY += 28
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, PAD + 24, lineY)

  yPos += 140

  // ── 底部 CTA ──
  const footerY = H - 180
  const footerGrad = ctx.createLinearGradient(0, footerY, 0, H)
  footerGrad.addColorStop(0, '#f8fafc')
  footerGrad.addColorStop(1, '#e2e8f0')
  ctx.fillStyle = footerGrad
  ctx.fillRect(0, footerY, W, H - footerY)

  // 分割线
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, footerY)
  ctx.lineTo(W - PAD, footerY)
  ctx.stroke()

  // CTA 文案
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 26px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('扫码或点击链接，测测你的企业培训水平', W / 2, footerY + 50)

  // URL
  ctx.fillStyle = '#2563eb'
  ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif'
  // 截断 URL 避免过长
  const displayUrl = data.shareUrl.length > 60
    ? data.shareUrl.substring(0, 57) + '...'
    : data.shareUrl
  ctx.fillText(displayUrl, W / 2, footerY + 90)

  // 品牌水印
  ctx.fillStyle = '#94a3b8'
  ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('TrainHub — 让企业培训更高效', W / 2, footerY + 140)

  ctx.textAlign = 'left'

  // ── 导出 ──
  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob))
      }
    }, 'image/png')
  })
}

/** 触发下载海报图片 */
export function downloadPoster(blobUrl: string, filename = 'trainhub-诊断报告.png') {
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
