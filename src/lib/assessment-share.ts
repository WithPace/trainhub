import { allQuestionIds, getLevelLabel } from './assessment'
import type { AssessmentReport } from './assessment'

/** 将评分压缩编码为 URL-safe 字符串 */
export function encodeScores(scores: Record<string, number>): string {
  const values = allQuestionIds.map(id => scores[id] || 0)
  return btoa(values.join(','))
}

/** 从编码字符串还原评分 */
export function decodeScores(encoded: string): Record<string, number> | null {
  try {
    const values = atob(encoded).split(',').map(Number)
    if (values.length !== allQuestionIds.length || values.some(v => v < 1 || v > 5)) return null
    const scores: Record<string, number> = {}
    allQuestionIds.forEach((id, i) => { scores[id] = values[i] })
    return scores
  } catch {
    return null
  }
}

/** 生成当前结果的分享链接 */
export function buildShareUrl(scores: Record<string, number>): string {
  const base = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://withpace.github.io/trainhub/assessment'
  return `${base}?r=${encodeScores(scores)}`
}

/** 生成微信分享文案 */
export function buildWeChatShareText(report: AssessmentReport, scores: Record<string, number>): string {
  return (
    `我的企业培训需求诊断结果：${getLevelLabel(report.overallLevel)}（${report.overallScore}/5.0）\n` +
    `${report.dimensions.map(d => `${d.dimension.name}: ${getLevelLabel(d.level)}`).join(' | ')}\n` +
    `来测测你的企业培训水平 👉 ${buildShareUrl(scores)}`
  )
}

/** 生成 LinkedIn 分享 URL */
export function buildLinkedInShareUrl(scores: Record<string, number>): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildShareUrl(scores))}`
}

/** SEO 结构化数据 */
export function buildAssessmentSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: '企业培训需求诊断 -- TrainHub',
        description: '3分钟快速评估企业培训现状，获取专业诊断报告和改进建议，涵盖领导力、专业技能、团队协作、数字化能力四大维度',
        url: 'https://withpace.github.io/trainhub/assessment',
        isPartOf: {
          '@type': 'WebSite',
          name: 'TrainHub',
          url: 'https://withpace.github.io/trainhub/',
        },
      },
      {
        '@type': 'HowTo',
        name: '如何进行企业培训需求自评',
        description: '通过回答10个问题，快速评估企业在领导力、专业技能、团队协作、数字化能力四个维度的培训需求',
        step: [
          { '@type': 'HowToStep', position: 1, name: '填写评估问卷', text: '对10个问题进行1-5分评分，涵盖领导力发展、专业技能、团队协作和数字化能力四个维度' },
          { '@type': 'HowToStep', position: 2, name: '查看诊断报告', text: '系统自动生成各维度评分、等级评定和文字评语' },
          { '@type': 'HowToStep', position: 3, name: '获取改进建议', text: '根据诊断结果获取针对性的培训改进建议和行动方案' },
        ],
      },
    ],
  }
}
