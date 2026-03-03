import { Link } from 'react-router-dom'

interface TopicCTAProps {
  categoryName: string
}

export default function TopicCTA({ categoryName }: TopicCTAProps) {
  return (
    <section className="bg-blue-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold sm:text-3xl">
          需要{categoryName}方面的企业培训？
        </h2>
        <p className="mt-3 text-blue-100">
          告诉我们您的需求，我们为您匹配最合适的{categoryName}培训师和课程方案
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/about"
            className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            免费咨询
          </Link>
          <Link
            to="/join"
            className="inline-block rounded-lg border border-white/30 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            我是培训师，申请入驻
          </Link>
        </div>
      </div>
    </section>
  )
}
