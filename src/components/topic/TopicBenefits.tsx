import { Target, TrendingUp } from 'lucide-react'

interface Benefit {
  title: string
  description: string
}

interface TopicBenefitsProps {
  benefits: Benefit[]
}

export default function TopicBenefits({ benefits }: TopicBenefitsProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">培训能带来什么</h2>
          <p className="mt-2 text-gray-500">系统化培训的核心价值</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                {index % 2 === 0
                  ? <Target className="h-6 w-6 text-blue-600" />
                  : <TrendingUp className="h-6 w-6 text-blue-600" />
                }
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
