import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { blogPosts } from '@/data/blog'

export default function BlogPage() {
  // 设置页面标题和 JSON-LD
  useEffect(() => {
    document.title = '行业洞察 - TrainHub | 企业培训行业趋势与最佳实践'

    // 插入 JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '行业洞察 - TrainHub',
      description: '企业培训行业的最新趋势、最佳实践和深度分析',
      numberOfItems: blogPosts.length,
      itemListElement: blogPosts.map((post, index) => ({
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

  return (
    <div>
      {/* 页面头部 */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">行业洞察</h1>
          <p className="mt-4 text-lg text-blue-100">
            企业培训行业的最新趋势、最佳实践和深度分析
          </p>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogPosts.map(post => (
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

                  {/* 摘要 */}
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
