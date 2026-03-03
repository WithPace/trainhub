import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, BookOpen, Award, Shield, Zap, TrendingUp, ClipboardCheck, Calendar, Clock } from 'lucide-react'
import { getCategories, getTrainers, getCourses } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import TrainerCard from '@/components/ui/TrainerCard'
import CourseCard from '@/components/ui/CourseCard'
import SearchBar from '@/components/ui/SearchBar'
import type { BlogPostMeta } from '@/data/blog-meta'

/** 异步加载最新博客文章（保持 blog-meta 独立 chunk，不污染主 bundle） */
async function fetchLatestBlogPosts(): Promise<BlogPostMeta[]> {
  const { getLatestBlogPosts } = await import('@/data/blog-meta')
  return getLatestBlogPosts(3)
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: categories } = useQuery(() => getCategories(), [])
  const { data: featuredTrainers } = useQuery(() => getTrainers({ featured: true }), [])
  const { data: featuredCourses } = useQuery(() => getCourses({ featured: true }), [])
  const { data: latestPosts } = useQuery(fetchLatestBlogPosts, [])

  return (
    <div>
      {/* Hero 区域 */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            找到最适合企业的培训师
          </h1>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            TrainHub 连接企业与顶尖培训师，一站式解决企业培训需求
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜索培训师、课程或专业领域..."
              className="[&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-blue-200"
            />
          </div>
          {searchQuery && (
            <div className="mt-4">
              <Link
                to={`/courses?q=${encodeURIComponent(searchQuery)}`}
                className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white"
              >
                查看搜索结果 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 价值亮点 */}
      <section className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
          {[
            { icon: Users, label: '严选培训师', value: '精挑细选' },
            { icon: BookOpen, label: '涵盖领域', value: '6大方向' },
            { icon: Award, label: '对接模式', value: '去中间商' },
            { icon: CheckCircle, label: '咨询服务', value: '免费' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-8 w-8 text-blue-600" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 分类导航 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">培训领域</h2>
            <p className="mt-2 text-gray-500">覆盖企业培训核心领域</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {(categories ?? []).map(cat => (
              <Link
                key={cat.id}
                to={`/topics/${cat.slug}`}
                className="group rounded-xl border border-gray-200 p-4 text-center transition-all hover:border-blue-300 hover:shadow-md sm:p-6"
              >
                <span className="text-4xl">{cat.icon}</span>
                <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600">
                  {cat.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选培训师 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">精选培训师</h2>
              <p className="mt-1 text-gray-500">经过严格筛选的行业专家</p>
            </div>
            <Link
              to="/trainers"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(featuredTrainers ?? []).map(trainer => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </div>
      </section>

      {/* 精选课程 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">热门课程</h2>
              <p className="mt-1 text-gray-500">最受企业欢迎的培训课程</p>
            </div>
            <Link
              to="/courses"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredCourses ?? []).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">最新文章</h2>
              <p className="mt-1 text-gray-500">行业洞察与培训管理实操干货</p>
            </div>
            <Link
              to="/blog"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {(latestPosts ?? []).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {post.category}
                </span>
                <h3 className="mt-3 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选择 TrainHub */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">为什么选择 TrainHub</h2>
            <p className="mt-2 text-gray-500">企业培训采购的更优解</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">严选师资，质量保障</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                每位培训师经过资质审核、授课评估和学员反馈三重筛选。平均从业经验14年，累计服务企业超过2000家。拒绝"PPT朗读者"，只推荐真正能落地的实战派。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">去中间商，透明定价</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                传统培训采购经过3-4层中间商，价格虚高50%-200%。TrainHub让企业直接对接培训师，课程大纲、价格区间、学员评价全部公开透明，不花冤枉钱。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">数据驱动，精准匹配</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                基于行业、规模、培训目标智能推荐最合适的培训师和课程。覆盖领导力、销售、数字化转型等6大核心领域，从需求到落地一站式解决。
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm leading-relaxed text-gray-600">
              中国企业培训市场规模超过<span className="font-semibold text-gray-900">6000亿元</span>，但企业找到合适培训师的平均周期长达<span className="font-semibold text-gray-900">3-4周</span>。
              TrainHub 致力于缩短这个周期到<span className="font-semibold text-blue-600">3天</span>，让每一笔培训预算都花在刀刃上。
            </p>
          </div>
        </div>
      </section>

      {/* 需求诊断入口 */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <ClipboardCheck className="h-7 w-7 text-indigo-600" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
            不确定从哪里开始？3分钟诊断培训需求
          </h2>
          <p className="mt-3 text-gray-500">
            回答 10 个问题，快速了解企业在领导力、专业技能、团队协作、数字化能力四个维度的培训现状，获取专属诊断报告
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              开始需求诊断 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/match"
              className="inline-block rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              直接智能匹配
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — 智能匹配 */}
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

      {/* CTA — 培训师入驻 */}
      <section className="bg-emerald-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">您是培训师？加入我们</h2>
          <p className="mt-3 text-emerald-100">
            展示您的专业能力，直接对接优质企业客户，零佣金入驻
          </p>
          <Link
            to="/join"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            申请入驻
          </Link>
        </div>
      </section>
    </div>
  )
}
