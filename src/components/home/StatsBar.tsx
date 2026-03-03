import { Users, BookOpen, Award, CheckCircle } from 'lucide-react'

const stats = [
  { icon: Users, label: '严选培训师', value: '15位实战派' },
  { icon: BookOpen, label: '覆盖领域', value: '6大方向' },
  { icon: Award, label: '中间成本', value: '省50%+' },
  { icon: CheckCircle, label: '需求诊断', value: '免费' },
]

export default function StatsBar() {
  return (
    <section className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className="text-center">
            <stat.icon className="mx-auto h-8 w-8 text-blue-600" />
            <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
