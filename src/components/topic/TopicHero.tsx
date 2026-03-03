import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight } from 'lucide-react'
import type { TopicData } from '@/data/topics'

// 每个分类对应的渐变背景
const heroBgMap: Record<string, string> = {
  leadership: 'from-blue-600 to-blue-800',
  sales: 'from-orange-500 to-orange-700',
  digital: 'from-violet-600 to-violet-800',
  hr: 'from-teal-600 to-teal-800',
  finance: 'from-emerald-600 to-emerald-800',
  communication: 'from-pink-500 to-pink-700',
  'project-management': 'from-amber-600 to-amber-800',
  culture: 'from-cyan-600 to-cyan-800',
  compliance: 'from-slate-600 to-slate-800',
}

interface TopicHeroProps {
  topic: TopicData
  categoryName: string
  categoryIcon: string
}

export default function TopicHero({ topic, categoryName, categoryIcon }: TopicHeroProps) {
  return (
    <section className={`bg-gradient-to-br ${heroBgMap[topic.slug] || 'from-blue-600 to-blue-800'} px-4 py-20 text-white sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-4xl text-center">
        {/* 面包屑导航 */}
        <nav className="mb-8 flex items-center justify-center gap-1 text-sm text-white/70">
          <Link to="/" className="hover:text-white">首页</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{categoryName}培训</span>
        </nav>

        <span className="text-5xl">{categoryIcon}</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
          {topic.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-white/80 sm:text-xl">
          {topic.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to={`/courses?category=${topic.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100"
          >
            查看相关课程 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/trainers"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            查看相关培训师
          </Link>
        </div>
      </div>
    </section>
  )
}
