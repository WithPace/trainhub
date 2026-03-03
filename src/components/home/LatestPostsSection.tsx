import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import type { BlogPostMeta } from '@/data/blog-meta'

interface LatestPostsSectionProps {
  posts: BlogPostMeta[] | null
}

export default function LatestPostsSection({ posts }: LatestPostsSectionProps) {
  return (
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
          {(posts ?? []).map(post => (
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
  )
}
