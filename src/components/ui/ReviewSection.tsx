import { Star } from 'lucide-react'
import type { Review } from '@/types'

interface ReviewSectionProps {
  reviews: Review[]
  title?: string
}

/** 评价展示区块 */
export default function ReviewSection({ reviews, title = '学员评价' }: ReviewSectionProps) {
  if (reviews.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900">
        {title}（{reviews.length}条）
      </h2>
      <div className="mt-6 space-y-4">
        {reviews.map(review => (
          <div
            key={review.id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="font-medium text-gray-900">
                  {review.author}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {review.company} · {review.role}
                </span>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {review.content}
            </p>
            <time className="mt-2 block text-xs text-gray-400">
              {review.date}
            </time>
          </div>
        ))}
      </div>
    </div>
  )
}
