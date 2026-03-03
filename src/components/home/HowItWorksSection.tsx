import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquareText, Brain, Handshake } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: MessageSquareText,
    title: '描述需求',
    desc: '5 个问题快速定位培训方向、预算范围和人数规模',
    cta: { label: '开始匹配', to: '/match' },
    color: 'blue',
  },
  {
    step: '02',
    icon: Brain,
    title: '智能匹配',
    desc: '基于行业、规模、目标，AI 推荐最匹配的培训师和课程',
    cta: { label: '试试需求诊断', to: '/assessment' },
    color: 'indigo',
  },
  {
    step: '03',
    icon: Handshake,
    title: '直接对接',
    desc: '零中间商，直接与培训师沟通方案和报价，价格透明',
    cta: { label: '浏览培训师', to: '/trainers' },
    color: 'emerald',
  },
]

const colorMap: Record<string, { bg: string; ring: string; text: string; ctaBg: string; ctaHover: string }> = {
  blue:    { bg: 'bg-blue-50',    ring: 'ring-blue-600',    text: 'text-blue-600',    ctaBg: 'bg-blue-600',    ctaHover: 'hover:bg-blue-700' },
  indigo:  { bg: 'bg-indigo-50',  ring: 'ring-indigo-600',  text: 'text-indigo-600',  ctaBg: 'bg-indigo-600',  ctaHover: 'hover:bg-indigo-700' },
  emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-600', text: 'text-emerald-600', ctaBg: 'bg-emerald-600', ctaHover: 'hover:bg-emerald-700' },
}

export default function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">3 步找到最合适的培训师</h2>
          <p className="mt-2 text-gray-500">从需求到落地，最快 3 天搞定</p>
        </div>
        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
          {/* 连接线（仅桌面端） */}
          <div className="pointer-events-none absolute inset-x-0 top-12 hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block" style={{ left: '16.7%', right: '16.7%' }} />

          {steps.map(item => {
            const c = colorMap[item.color]
            return (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className={`relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full ${c.bg} ring-4 ${c.ring} ring-offset-2`}>
                  <item.icon className={`h-8 w-8 ${c.text}`} />
                  <span className={`mt-1 text-xs font-bold ${c.text}`}>STEP {item.step}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">{item.desc}</p>
                <Link
                  to={item.cta.to}
                  className={`mt-4 inline-flex items-center gap-1 rounded-lg ${c.ctaBg} px-4 py-2 text-sm font-medium text-white transition-colors ${c.ctaHover}`}
                >
                  {item.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
