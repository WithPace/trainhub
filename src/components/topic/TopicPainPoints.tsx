import { AlertTriangle } from 'lucide-react'

interface PainPoint {
  title: string
  description: string
}

interface TopicPainPointsProps {
  painPoints: PainPoint[]
}

export default function TopicPainPoints({ painPoints }: TopicPainPointsProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">企业常见痛点</h2>
          <p className="mt-2 text-gray-500">这些问题是否也困扰着您的企业？</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
