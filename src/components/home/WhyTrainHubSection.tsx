import { Shield, Zap, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Shield,
    color: 'blue',
    title: '严选师资，质量保障',
    description:
      '每位培训师经过资质审核、授课评估和学员反馈三重筛选。平均从业经验14年，累计服务企业超过2000家。拒绝"PPT朗读者"，只推荐真正能落地的实战派。',
  },
  {
    icon: Zap,
    color: 'green',
    title: '去中间商，透明定价',
    description:
      '传统培训采购经过3-4层中间商，价格虚高50%-200%。TrainHub让企业直接对接培训师，课程大纲、价格区间、学员评价全部公开透明，不花冤枉钱。',
  },
  {
    icon: TrendingUp,
    color: 'purple',
    title: '数据驱动，精准匹配',
    description:
      '基于行业、规模、培训目标智能推荐最合适的培训师和课程。覆盖领导力、销售、数字化转型等6大核心领域，从需求到落地一站式解决。',
  },
]

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
}

export default function WhyTrainHubSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">为什么选择 TrainHub</h2>
          <p className="mt-2 text-gray-500">企业培训采购的更优解</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(feature => {
            const c = colorMap[feature.color]
            return (
              <div key={feature.title} className="text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
                  <feature.icon className={`h-6 w-6 ${c.text}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-10 rounded-xl bg-gray-50 p-6 text-center">
          <p className="text-sm leading-relaxed text-gray-600">
            中国企业培训市场规模超过<span className="font-semibold text-gray-900">6000亿元</span>，但企业找到合适培训师的平均周期长达<span className="font-semibold text-gray-900">3-4周</span>。
            TrainHub 致力于缩短这个周期到<span className="font-semibold text-blue-600">3天</span>，让每一笔培训预算都花在刀刃上。
          </p>
        </div>
      </div>
    </section>
  )
}
