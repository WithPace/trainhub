import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react'
import type { BlogPostMeta } from '@/data/blog-meta'

interface TopicRelatedPostsProps {
  categoryName: string
  posts: BlogPostMeta[]
}

export default function TopicRelatedPosts({ categoryName, posts }: TopicRelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">{categoryName}培训干货</h2>
            </div>
            <p className="mt-1 text-gray-500">深度解读{categoryName}领域的培训趋势与实操方法</p>
          </div>
          <Link
            to={`/blog?q=${encodeURIComponent(categoryName)}`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            查看更多 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map(post => (
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
  )
}
