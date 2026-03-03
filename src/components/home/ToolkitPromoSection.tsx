import { Link } from 'react-router-dom'
import { ArrowRight, FileText, BarChart3, Calculator, ClipboardList, TrendingUp } from 'lucide-react'

const TOOLKIT_HIGHLIGHTS = [
  { icon: ClipboardList, title: '培训需求分析', slug: 'needs-analysis' },
  { icon: FileText, title: '年度培训计划', slug: 'annual-plan' },
  { icon: BarChart3, title: '培训效果评估', slug: 'effectiveness-eval' },
  { icon: Calculator, title: '培训预算规划', slug: 'budget-plan' },
  { icon: FileText, title: '培训招标比价', slug: 'procurement' },
  { icon: TrendingUp, title: '2026 趋势报告', slug: 'trends-report-2026' },
] as const

export default function ToolkitPromoSection() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            免费工具
          </span>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            企业培训决策工具包
          </h2>
          <p className="mt-3 text-gray-600">
            6 份专业模板 + 行业趋势报告，在线使用或打印，帮你节省 40+ 小时
          </p>
        </div>

        {/* 6 个工具包卡片 */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLKIT_HIGHLIGHTS.map(({ icon: Icon, title, slug }) => (
            <Link
              key={slug}
              to={`/toolkit/${slug}`}
              className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 transition-colors group-hover:bg-amber-200">
                <Icon className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-amber-700">
                  {title}
                </p>
                <p className="text-xs text-gray-400">在线使用 · 可打印</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/toolkit"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-600"
          >
            查看全部工具包 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
