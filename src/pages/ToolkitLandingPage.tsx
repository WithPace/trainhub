import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle, Calculator, BarChart3,
  ClipboardList, TrendingUp, ArrowRight, Shield, Clock, Zap,
} from 'lucide-react'
import PageHead from '@/components/seo/PageHead'
import { JsonLd } from '@/components/seo/JsonLd'
import ToolkitEmailForm from '@/components/ui/ToolkitEmailForm'

/** 工具包内含物品 */
const TOOLKIT_ITEMS = [
  {
    icon: ClipboardList,
    title: '培训需求分析模板',
    desc: '结构化的需求调研问卷 + 分析框架，帮你精准定位培训痛点',
    slug: 'needs-analysis',
  },
  {
    icon: FileText,
    title: '年度培训计划模板',
    desc: '可直接使用的 Excel 计划模板，含课程排期、预算分配、KPI 设定',
    slug: 'annual-plan',
  },
  {
    icon: BarChart3,
    title: '培训效果评估工具',
    desc: '基于柯氏四级模型的评估量表 + 数据分析模板',
    slug: 'effectiveness-eval',
  },
  {
    icon: Calculator,
    title: '培训预算规划表',
    desc: '分行业基准数据 + 自动计算的预算规划 Excel 模板',
    slug: 'budget-plan',
  },
  {
    icon: FileText,
    title: '培训招标/比价模板',
    desc: '标准化的供应商评估矩阵 + 招标文件框架',
    slug: 'procurement',
  },
  {
    icon: TrendingUp,
    title: '2026 企业培训趋势报告',
    desc: '覆盖 AI 培训、领导力、数字化等 9 大热门领域的趋势分析',
    slug: 'trends-report-2026',
  },
]

/** 适用人群 */
const TARGET_USERS = [
  { role: 'HR 总监/经理', pain: '需要向管理层汇报培训 ROI，缺乏量化工具' },
  { role: '培训经理', pain: '每年做培训计划靠经验，缺少标准化流程' },
  { role: '企业大学负责人', pain: '需要搭建系统化的培训体系' },
  { role: '创业公司 CEO', pain: '想做培训但不知道从哪里开始' },
]

export default function ToolkitLandingPage() {
  return (
    <>
      <PageHead
        title="免费领取企业培训决策工具包 — 6 合 1 模板 + 报告 | TrainHub"
        description="免费领取一套完整的企业培训管理工具：需求分析模板、年度计划模板、效果评估工具、预算规划表、招标比价模板、趋势报告。HR 和培训经理的效率利器。"
        path="/toolkit"
        ogImage="https://withpace.github.io/trainhub/og/toolkit/landing.webp"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: '企业培训决策工具包',
          description: '包含培训需求分析、年度计划、效果评估、预算规划、招标比价、趋势报告的 6 合 1 企业培训管理工具包。免费领取。',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'CNY',
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-green-400/20 px-4 py-1.5 text-sm font-medium text-green-200 backdrop-blur-sm">
              免费领取
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              企业培训决策工具包
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 sm:text-xl">
              6 份专业模板 + 行业报告，让你的培训管理从"拍脑袋"升级为"数据驱动"
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="text-3xl font-bold">¥0</span>
              <span className="text-lg text-blue-200 line-through">¥299</span>
              <span className="rounded-full bg-green-400 px-3 py-1 text-sm font-semibold text-green-900">
                限时免费
              </span>
            </div>
            <a
              href="#get-toolkit"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              免费领取 <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* 包含什么 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            工具包包含什么？
          </h2>
          <p className="mt-3 text-center text-gray-500">
            6 份经过实战检验的专业工具，覆盖培训管理全流程
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLKIT_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={`/toolkit/${item.slug}`}
                className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <item.icon className="h-8 w-8 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  查看详情 <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 谁需要 */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            谁需要这个工具包？
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {TARGET_USERS.map((user) => (
              <div
                key={user.role}
                className="flex gap-4 rounded-xl bg-white p-6 shadow-sm"
              >
                <CheckCircle className="h-6 w-6 shrink-0 text-green-500" />
                <div>
                  <p className="font-semibold text-gray-900">{user.role}</p>
                  <p className="mt-1 text-sm text-gray-500">{user.pain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 优势 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <Clock className="mx-auto h-10 w-10 text-blue-600" />
              <h3 className="mt-4 text-lg font-semibold">节省 40+ 小时</h3>
              <p className="mt-2 text-sm text-gray-500">
                不用从零制作培训文档，拿来就能用
              </p>
            </div>
            <div className="text-center">
              <Zap className="mx-auto h-10 w-10 text-amber-500" />
              <h3 className="mt-4 text-lg font-semibold">数据驱动决策</h3>
              <p className="mt-2 text-sm text-gray-500">
                基于行业基准数据，让培训投入有据可依
              </p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto h-10 w-10 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold">专业团队出品</h3>
              <p className="mt-2 text-sm text-gray-500">
                参考 500 强企业培训体系，持续更新迭代
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 表单 */}
      <section id="get-toolkit" className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 sm:py-20">
        <div className="mx-auto max-w-xl px-4 text-center lg:px-8">
          <ToolkitEmailForm source="toolkit-landing" />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">常见问题</h2>
          <dl className="mt-10 space-y-6">
            {[
              {
                q: '工具包真的免费吗？',
                a: '是的，完全免费。留下邮箱即可在线使用全部 6 份专业模板和趋势报告，无隐藏费用。',
              },
              {
                q: '工具包包含哪些内容？',
                a: '包含培训需求分析模板、年度培训计划模板、培训效果评估工具、预算规划表、招标比价模板和 2026 培训趋势报告，共 6 份专业工具。',
              },
              {
                q: '可以打印使用吗？',
                a: '可以。所有模板都支持在线使用和打印/导出 PDF，方便在会议中使用或归档。',
              },
              {
                q: '和网上免费的培训模板有什么区别？',
                a: '我们的模板基于 500 强企业实践，包含行业基准数据、评分标准和使用建议。不是空模板，而是"填数据就能用"的决策工具。',
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <dt className="font-semibold text-gray-900">{faq.q}</dt>
                <dd className="mt-2 text-sm text-gray-500">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <p className="text-gray-500">
            已经在使用 TrainHub？试试
            <Link to="/tools/budget-calculator" className="mx-1 text-blue-600 hover:underline">预算计算器</Link>
            和
            <Link to="/tools/roi-calculator" className="mx-1 text-blue-600 hover:underline">ROI 计算器</Link>
            ，或浏览
            <Link to="/blog" className="mx-1 text-blue-600 hover:underline">90+ 篇行业洞察文章</Link>。
          </p>
        </div>
      </section>
    </>
  )
}
