import { Link } from 'react-router-dom'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import type { BlogPostMeta } from '@/data/blog-meta'

interface RelatedBlogSectionProps {
  posts: BlogPostMeta[]
  title?: string
}

/** 相关博客文章推荐区块（用于课程/培训师详情页交叉引流） */
export default function RelatedBlogSection({ posts, title = '相关文章推荐' }: RelatedBlogSectionProps) {
  if (!posts.length) return null

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link
          to="/blog"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          查看全部
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {post.category}
            </span>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
              {post.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
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
    </section>
  )
}
