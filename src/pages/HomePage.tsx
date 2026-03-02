import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, BookOpen, Award } from 'lucide-react'
import { getCategories, getTrainers, getCourses } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import TrainerCard from '@/components/ui/TrainerCard'
import CourseCard from '@/components/ui/CourseCard'
import SearchBar from '@/components/ui/SearchBar'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: categories } = useQuery(() => getCategories(), [])
  const { data: featuredTrainers } = useQuery(() => getTrainers({ featured: true }), [])
  const { data: featuredCourses } = useQuery(() => getCourses({ featured: true }), [])

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
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
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
                className="group rounded-xl border border-gray-200 p-6 text-center transition-all hover:border-blue-300 hover:shadow-md"
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

      {/* CTA — 企业咨询 */}
      <section className="bg-blue-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">需要定制化企业培训方案？</h2>
          <p className="mt-3 text-blue-100">
            告诉我们您的需求，我们为您匹配最合适的培训师和课程
          </p>
          <Link
            to="/about"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            免费咨询
          </Link>
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
