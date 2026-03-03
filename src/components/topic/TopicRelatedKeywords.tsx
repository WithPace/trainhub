import { Link } from 'react-router-dom'

interface TopicRelatedKeywordsProps {
  keywords: string[]
}

export default function TopicRelatedKeywords({ keywords }: TopicRelatedKeywordsProps) {
  return (
    <section className="border-t border-gray-200 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-medium text-gray-400">相关搜索</p>
        <div className="flex flex-wrap gap-2">
          {keywords.map(keyword => (
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
  )
}
