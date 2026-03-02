import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { blogPostsMeta } from '@/data/blog-meta'

const POSTS_PER_PAGE = 12

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [currentPage, setCurrentPage] = useState(1)

  // 提取所有分类（去重）
  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(blogPostsMeta.map(post => post.category)))
    return ['全部', ...cats]
  }, [])

  // 按分类筛选
  const filteredPosts = useMemo(() => {
    if (selectedCategory === '全部') return blogPostsMeta
    return blogPostsMeta.filter(post => post.category === selectedCategory)
  }, [selectedCategory])

  // 分页计算
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(start, start + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  // 切换分类时重置到第一页
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  // 生成页码列表（最多显示 7 个页码，中间省略）
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = [1]

    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)

    return pages
  }, [currentPage, totalPages])

  // 设置页面标题和 JSON-LD
  useEffect(() => {
    document.title = '行业洞察 - TrainHub | 企业培训行业趋势与最佳实践'

    // 插入 JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '行业洞察 - TrainHub',
      description: '企业培训行业的最新趋势、最佳实践和深度分析',
      numberOfItems: blogPostsMeta.length,
      itemListElement: blogPostsMeta.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://withpace.github.io/trainhub/blog/${post.id}`,
        name: post.title,
      })),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    script.id = 'blog-list-jsonld'
    document.head.appendChild(script)

    return () => {
      const existing = document.getElementById('blog-list-jsonld')
      if (existing) existing.remove()
    }
  }, [])

  // 文章数量显示文案
  const countLabel = selectedCategory === '全部'
    ? `共 ${filteredPosts.length} 篇文章`
    : `${selectedCategory} (${filteredPosts.length})`

  return (
    <div>
      {/* 页面头部 */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">��业洞察</h1>
          <p className="mt-4 text-lg text-blue-100">
            企业培训行业的最新趋势、最佳实践和深度分析
          </p>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* 分类筛选标签 */}
          <div className="mb-6 flex flex-wrap gap-2">
            {allCategories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={
                  selectedCategory === category
                    ? 'rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors'
                    : 'rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600'
                }
              >
                {category}
              </button>
            ))}
          </div>

          {/* 文章数量 */}
          <p className="mb-6 text-sm text-gray-500">{countLabel}</p>

          {/* 文章卡片网格 */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {paginatedPosts.map(post => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-lg"
              >
                <div className="p-6">
                  {/* 分类标签 + 阅读时长 */}
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h2 className="mt-4 text-lg font-bold leading-snug text-gray-900 group-hover:text-blue-600">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>

                  {/* ��要 */}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {post.excerpt}
                  </p>

                  {/* 底部：日期 + 阅读全文 */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {post.publishDate}
                    </span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      阅读全文 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1" aria-label="分页导航">
              {/* 上一页 */}
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </button>

              {/* 页码 */}
              {pageNumbers.map((page, index) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white'
                        : 'flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
                    }
                  >
                    {page}
                  </button>
                ),
              )}

              {/* 下一页 */}
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            想要找到最适合企业的培训师？
          </h2>
          <p className="mt-3 text-gray-500">
            TrainHub 连接企业与顶尖培训师，信息透明、直接对接、零中间加价
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/trainers"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              浏览培训师
            </Link>
            <Link
              to="/courses"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              浏览课程
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
