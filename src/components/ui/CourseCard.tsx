import { Link } from 'react-router-dom'
import { Clock, Users, DollarSign } from 'lucide-react'
import type { Course } from '@/types'
import CategoryBadge from './CategoryBadge'

interface CourseCardProps {
  course: Course
}

// 价格区间格式化（如 "30000-50000" -> "3-5万"）
function formatPriceRange(range: string): string {
  const parts = range.split('-')
  if (parts.length !== 2) return range
  const low = Math.round(parseInt(parts[0]) / 10000)
  const high = Math.round(parseInt(parts[1]) / 10000)
  if (low === high) return `${low}万`
  return `${low}-${high}万`
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* 分类标签条 */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 sm:px-6 sm:py-3">
        {course.category_name && (
          <CategoryBadge name={course.category_name} />
        )}
      </div>

      <div className="p-4 sm:p-5 md:p-6">
        {/* 标题 */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {course.title}
        </h3>

        {/* 描述 */}
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {course.description}
        </p>

        {/* 培训师 */}
        {course.trainer_name && (
          <p className="mt-3 text-sm text-gray-600">
            讲师：<span className="font-medium">{course.trainer_name}</span>
            {course.trainer_title && (
              <span className="text-gray-400"> | {course.trainer_title}</span>
            )}
          </p>
        )}

        {/* 课程信息 */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.max_participants}人
          </span>
          <span className="flex items-center gap-1 font-medium text-blue-600">
            <DollarSign className="h-4 w-4" />
            {formatPriceRange(course.price_range)}
          </span>
        </div>
      </div>
    </Link>
  )
}
