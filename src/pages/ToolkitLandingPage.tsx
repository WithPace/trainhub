import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle, Download, Calculator, BarChart3,
  ClipboardList, TrendingUp, Mail, ArrowRight, Shield, Clock, Zap,
} from 'lucide-react'
import PageHead from '@/components/seo/PageHead'
import { JsonLd } from '@/components/seo/JsonLd'

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

const STORAGE_KEY = 'toolkit-waitlist'

function getWaitlistCount(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return 0
    const list = JSON.parse(data)
    return Array.isArray(list) ? list.length : 0
  } catch {
    return 0
  }
}

function addToWaitlist(email: string): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const list: string[] = data ? JSON.parse(data) : []
    if (list.includes(email)) return false
    list.push(email)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export default function ToolkitLandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [waitlistCount] = useState(() => getWaitlistCount())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('请输入有效的邮箱地址')
      return
    }

    addToWaitlist(trimmed)
    setSubmitted(true)

    // mailto 兜底：即使没有后端，邮件客户端也能发送
    const subject = encodeURIComponent('预约：企业培训决策工具包')
    const body = encodeURIComponent(`我对"企业培训决策工具包"感兴趣，请在上线后通知我。\n\n邮箱: ${trimmed}`)
    window.open(`mailto:hi@trainhub.cn?subject=${subject}&body=${body}`, '_self')
  }

  return (
    <>
      <PageHead
        title="企业培训决策工具包 — 6 合 1 模板 + 报告 | TrainHub"
        description="一套完整的企业培训管理工具：需求分析模板、年度计划模板、效果评估工具、预算规划表、招标比价模板、趋势报告。HR 和培训经理的效率利器。"
        path="/toolkit"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: '企业培训决策工具包',
          description: '包含培训需求分析、年度计划、效果评估、预算规划、招标比价、趋势报告的 6 合 1 企业培训管理工具包。',
          offers: {
            '@type': 'Offer',
            price: '99',
            priceCurrency: 'CNY',
            availability: 'https://schema.org/PreOrder',
          },
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              限时预售
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              企业培训决策工具包
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 sm:text-xl">
              6 份专业模板 + 行业报告，让你的培训管理从"拍脑袋"升级为"数据驱动"
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-4xl font-bold">¥99</span>
              <span className="text-lg text-blue-200 line-through">¥299</span>
              <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-amber-900">
                首发价 3.3 折
              </span>
            </div>
            <a
              href="#get-toolkit"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              立即预约 <ArrowRight className="h-5 w-5" />
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
          {!submitted ? (
            <>
              <Download className="mx-auto h-12 w-12 text-white/80" />
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                工具包即将上线
              </h2>
              <p className="mt-3 text-blue-100">
                留下邮箱，上线后第一时间以首发价 ¥99 获取（原价 ¥299）
              </p>
              {waitlistCount > 0 && (
                <p className="mt-2 text-sm text-blue-200">
                  已有 {waitlistCount} 人预约
                </p>
              )}
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@company.com"
                      className="w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-amber-900 shadow-sm transition-colors hover:bg-amber-300"
                  >
                    立即预约
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-200">{error}</p>
                )}
                <p className="mt-3 text-xs text-blue-200">
                  仅用于发送工具包上线通知，不会发送垃圾邮件
                </p>
              </form>
            </>
          ) : (
            <div className="py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-300" />
              <h2 className="mt-4 text-2xl font-bold text-white">
                预约成功！
              </h2>
              <p className="mt-3 text-blue-100">
                工具包上线后我们会第一时间通知你。
                同时，你可以先看看我们的免费工具：
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/tools/budget-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <Calculator className="h-4 w-4" /> 免费预算计算器
                </Link>
                <Link
                  to="/tools/roi-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <TrendingUp className="h-4 w-4" /> 免费 ROI 计算器
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">常见问题</h2>
          <dl className="mt-10 space-y-6">
            {[
              {
                q: '工具包什么时候上线？',
                a: '预计 2026 年 3 月底上线。预约用户将第一时间收到通知并享受首发价。',
              },
              {
                q: '工具包包含哪些格式的文件？',
                a: '包含 Excel 模板（.xlsx）、Word 文档（.docx）和 PDF 报告。所有模板均可直接编辑使用。',
              },
              {
                q: '购买后能退款吗？',
                a: '7 天无理由退款。如果工具包不适合你的需求，全额退款。',
              },
              {
                q: '和网上免费的培训模板有什么区别？',
                a: '我们的模板基于 500 强企业实践，包含行业基准数据和自动计算公式。不是空模板，而是"填数据就能用"的决策工具。',
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
            已经在使用 TrainHub？看看我们的
            <Link to="/tools/budget-calculator" className="mx-1 text-blue-600 hover:underline">免费预算计算器</Link>
            和
            <Link to="/tools/roi-calculator" className="mx-1 text-blue-600 hover:underline">ROI 计算器</Link>
            ，或浏览
            <Link to="/blog" className="mx-1 text-blue-600 hover:underline">75+ 篇行业洞察文章</Link>。
          </p>
        </div>
      </section>
    </>
  )
}
