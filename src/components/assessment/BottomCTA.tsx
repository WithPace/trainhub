import { Link } from 'react-router-dom'

export default function BottomCTA() {
  return (
    <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-bold text-gray-900">不确定如何评估？</h2>
        <p className="mt-2 text-gray-500">
          资深培训顾问一对一帮您分析培训需求，制定针对性方案
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/about"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            联系培训顾问
          </Link>
          <Link
            to="/match"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            智能匹配推荐
          </Link>
        </div>
      </div>
    </section>
  )
}
