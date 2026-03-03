import { Star, Quote, ThumbsUp } from 'lucide-react'
import type { Review } from '@/types'

interface ReviewSectionProps {
  reviews: Review[]
  title?: string
}

/** 评价统计摘要 + 精选评价 + 评价列表 */
export default function ReviewSection({ reviews, title = '学员评价' }: ReviewSectionProps) {
  if (reviews.length === 0) return null

  // 计算统计数据
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const roundedAvg = Math.round(avgRating * 10) / 10

  // 评分分布（5→1）
  const distribution = [5, 4, 3, 2, 1].map(score => ({
    score,
    count: reviews.filter(r => r.rating === score).length,
    pct: Math.round((reviews.filter(r => r.rating === score).length / reviews.length) * 100),
  }))

  // 精选评价：评分最高 + 内容最长（最详细）的那条
  const featured = [...reviews]
    .sort((a, b) => b.rating - a.rating || b.content.length - a.content.length)[0]

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900">
        {title}（{reviews.length}条）
      </h2>

      {/* 摘要卡片 */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* 左侧：综合评分 */}
          <div className="flex flex-col items-center sm:min-w-[120px]">
            <span className="text-4xl font-black text-gray-900">{roundedAvg}</span>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="mt-1 text-xs text-gray-500">{reviews.length} 条评价</span>
          </div>

          {/* 右侧：评分分布 */}
          <div className="flex-1 space-y-1.5">
            {distribution.map(d => (
              <div key={d.score} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-right font-medium text-gray-600">{d.score}星</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-10 text-gray-500">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 精选评价 */}
        {featured && (
          <div className="mt-5 rounded-lg border border-amber-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <ThumbsUp className="h-3.5 w-3.5" />
              精选好评
            </div>
            <div className="mt-2 flex gap-2">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-sm leading-relaxed text-gray-700 line-clamp-3">
                {featured.content}
              </p>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              — {featured.author}，{featured.company} {featured.role}
            </div>
          </div>
        )}
      </div>

      {/* 评价列表 */}
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
