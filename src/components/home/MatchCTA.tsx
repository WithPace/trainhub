import { Link } from 'react-router-dom'

export default function MatchCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold sm:text-3xl">不知道选哪个？试试智能匹配</h2>
        <p className="mt-3 text-blue-100">
          回答 5 个简单问题，AI 为您推荐最适合的培训师和课程
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/match"
            className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            开始智能匹配
          </Link>
          <Link
            to="/about"
            className="inline-block rounded-lg border border-white/30 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            免费咨询
          </Link>
        </div>
      </div>
    </section>
  )
}
