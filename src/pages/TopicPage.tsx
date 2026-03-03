import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, AlertTriangle, Target, TrendingUp, ArrowRight, HelpCircle, Calendar, Clock, BookOpen } from 'lucide-react'
import { getTopicBySlug } from '@/data/topics'
import { categories, courses, trainers } from '@/data/mock'
import CourseCard from '@/components/ui/CourseCard'
import TrainerCard from '@/components/ui/TrainerCard'
import PageHead from '@/components/seo/PageHead'
import type { TopicData } from '@/data/topics'
import type { BlogPostMeta } from '@/data/blog-meta'

// 每个分类对应的浅色背景
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

// FAQ 折叠项组件
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-base font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-gray-600">
          {answer}
        </div>
      )}
    </div>
  )
}

// 构建 JSON-LD 结构化数据
function buildJsonLd(topic: TopicData, categoryName: string, baseUrl: string) {
  // 该分类下的课程
  const categoryCourses = courses.filter(c => c.category_id === topic.categoryId)

  // BreadcrumbList
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '培训领域',
        item: `${baseUrl}courses`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${baseUrl}topics/${topic.slug}`,
      },
    ],
  }

  // FAQPage
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  // ItemList（课程列表）
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName}培训课程`,
    numberOfItems: categoryCourses.length,
    itemListElement: categoryCourses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: course.title,
      url: `${baseUrl}courses/${course.id}`,
    })),
  }

  return [breadcrumb, faqPage, itemList]
}

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = slug ? getTopicBySlug(slug) : undefined

  // 查找分类信息
  const category = topic ? categories.find(c => c.id === topic.categoryId) : undefined

  // 筛选该分类下的课程
  const categoryCourses = topic ? courses.filter(c => c.category_id === topic.categoryId) : []

  // 筛选相关培训师（通过 specialties 匹配分类名称）
  const categoryTrainers = category
    ? trainers.filter(t =>
        t.specialties.some(s =>
          s.includes(category.name) ||
          category.description.split('、').some(keyword => s.includes(keyword))
        )
      )
    : []

  // 异步加载该领域的相关博客文章（保持 blog-meta 独立 chunk）
  const [relatedPosts, setRelatedPosts] = useState<BlogPostMeta[]>([])
  useEffect(() => {
    if (!topic || !category) return
    import('@/data/blog-meta').then(({ getRelatedBlogPostsByKeywords }) => {
      // 用分类名 + 前3个相关关键词进行匹配
      const keywords = [category.name, ...topic.relatedKeywords.slice(0, 3)]
      setRelatedPosts(getRelatedBlogPostsByKeywords(keywords, 4))
    })
  }, [topic?.slug, category?.name])

  const baseUrl = 'https://withpace.github.io/trainhub/'

  // 404 处理
  if (!topic || !category) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900">未找到该培训领域</h1>
        <p className="mt-2 text-gray-500">请返回首页查看所有培训领域</p>
        <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
          返回首页
        </Link>
      </div>
    )
  }

  const jsonLdData = buildJsonLd(topic, category.name, baseUrl)

  return (
    <div>
      <PageHead
        title={topic.title}
        description={topic.metaDescription}
        path={`/topics/${topic.slug}`}
      />
      {/* JSON-LD 结构化数据 */}
      {jsonLdData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* Section 1: Hero */}
      <section className={`bg-gradient-to-br ${heroBgMap[topic.slug] || 'from-blue-600 to-blue-800'} px-4 py-20 text-white sm:px-6 lg:px-8`}>
        <div className="mx-auto max-w-4xl text-center">
          {/* 面包屑导航 */}
          <nav className="mb-8 flex items-center justify-center gap-1 text-sm text-white/70">
            <Link to="/" className="hover:text-white">首页</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{category.name}培训</span>
          </nav>

          <span className="text-5xl">{category.icon}</span>
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

      {/* Section 2: 领域介绍 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900">关于{category.name}培训</h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600">
            {topic.introduction}
          </p>
        </div>
      </section>

      {/* Section 3: 企业常见痛点 */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">企业常见痛点</h2>
            <p className="mt-2 text-gray-500">这些问题是否也困扰着您的企业？</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topic.painPoints.map((point, index) => (
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

      {/* Section 3.5: 培训收益 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">培训能带来什么</h2>
            <p className="mt-2 text-gray-500">系统化培训的核心价值</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topic.benefits.map((benefit, index) => (
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

      {/* Section 4: 相关课程 */}
      {categoryCourses.length > 0 && (
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}培训课程</h2>
                <p className="mt-1 text-gray-500">精选{categoryCourses.length}门{category.name}相关课程</p>
              </div>
              <Link
                to={`/courses?category=${topic.slug}`}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: 相关培训师 */}
      {categoryTrainers.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}领域培训师</h2>
                <p className="mt-1 text-gray-500">经验丰富的{category.name}培训专家</p>
              </div>
              <Link
                to="/trainers"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categoryTrainers.map(trainer => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 6: FAQ */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">常见问题</h2>
            <p className="mt-2 text-gray-500">关于{category.name}培训的疑问解答</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-6">
            {topic.faq.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 6.5: 该领域相关文章 */}
      {relatedPosts.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{category!.name}培训干货</h2>
                </div>
                <p className="mt-1 text-gray-500">深度解读{category!.name}领域的培训趋势与实操方法</p>
              </div>
              <Link
                to={`/blog?q=${encodeURIComponent(category!.name)}`}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                查看更多 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {post.category}
                  </span>
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
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
      )}

      {/* Section 7: CTA */}
      <section className="bg-blue-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            需要{category.name}方面的企业培训？
          </h2>
          <p className="mt-3 text-blue-100">
            告诉我们您的需求，我们为您匹配最合适的{category.name}培训师和课程方案
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

      {/* 相关搜索词（对 SEO 有帮助，用隐藏的方式呈现） */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-medium text-gray-400">相关搜索</p>
          <div className="flex flex-wrap gap-2">
            {topic.relatedKeywords.map(keyword => (
              <Link
                key={keyword}
                to={`/courses?q=${encodeURIComponent(keyword)}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
