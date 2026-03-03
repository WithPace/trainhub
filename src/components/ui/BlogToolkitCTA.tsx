import { Link } from 'react-router-dom'
import { FileText, ArrowRight } from 'lucide-react'

/**
 * 博客文章内工具包推广 CTA
 * 根据文章分类智能匹配推荐文案，引导读者转化到工具包页面
 */

interface ToolkitMatch {
  headline: string
  desc: string
  slug: string
}

/** 分类 → 工具包推荐映射 */
const CATEGORY_TOOLKIT_MAP: Record<string, ToolkitMatch> = {
  '培训管理': {
    headline: '需要一套现成的培训管理工具？',
    desc: '培训需求分析 + 年度计划 + 效果评估 + 预算规划，6 份专业模板帮你节省 40+ 小时',
    slug: '/toolkit',
  },
  '行业洞察': {
    headline: '想把行业洞察落地为行动计划？',
    desc: '《2026 企业培训趋势报告》+ 5 份实操模板，从"看趋势"到"做计划"一步到位',
    slug: '/toolkit',
  },
  '培训采购': {
    headline: '正在采购培训服务？',
    desc: '标准化的供应商评估矩阵 + 招标比价模板，让采购决策有据可依',
    slug: '/toolkit',
  },
  '实操指南': {
    headline: '要的不是理论，是能直接用的工具？',
    desc: '6 合 1 企业培训决策工具包，填数据就能用的专业模板',
    slug: '/toolkit',
  },
  'AI与数字化': {
    headline: '用数据驱动培训决策',
    desc: '培训效果评估 + ROI 计算 + 预算规划，让每一分培训投入都有据可依',
    slug: '/toolkit',
  },
  '领导力': {
    headline: '领导力培训怎么规划？',
    desc: '年度培训计划模板 + 需求分析框架 + 效果评估工具，系统化提升管理层能力',
    slug: '/toolkit',
  },
  '培训师成长': {
    headline: '想提升报价底气？',
    desc: '培训效果评估工具 + 行业基准数据，用专业工具证明你的培训价值',
    slug: '/toolkit',
  },
}

/** 默认兜底文案 */
const DEFAULT_MATCH: ToolkitMatch = {
  headline: '企业培训决策工具包',
  desc: '6 份专业模板 + 行业报告，涵盖需求分析、年度计划、效果评估、预算规划、招标比价和趋势分析',
  slug: '/toolkit',
}

export default function BlogToolkitCTA({ category }: { category: string }) {
  const match = CATEGORY_TOOLKIT_MAP[category] ?? DEFAULT_MATCH

  return (
    <div className="my-8 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">{match.headline}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{match.desc}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              to={match.slug}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              查看工具包 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-xs text-gray-500">
              首发价 ¥99 · 6 份专业模板
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
