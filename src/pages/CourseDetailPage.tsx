import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, Users, DollarSign, CheckCircle } from 'lucide-react'
import { getCourseById as fetchCourse, getTrainerById as fetchTrainer } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import CategoryBadge from '@/components/ui/CategoryBadge'
import InquiryModal from '@/components/ui/InquiryModal'
import ReviewSection from '@/components/ui/ReviewSection'
import ShareButtons from '@/components/ui/ShareButtons'
import { getReviewsByCourseId } from '@/data/reviews'
import {
  JsonLd,
  BreadcrumbNav,
  buildCourseSchema,
  buildBreadcrumbSchema,
  courseBreadcrumbs,
} from '@/components/seo/JsonLd'

// 价格区间格式化
function formatPriceRange(range: string): string {
  const parts = range.split('-')
  if (parts.length !== 2) return range
  const low = Math.round(parseInt(parts[0]) / 10000)
  const high = Math.round(parseInt(parts[1]) / 10000)
  if (low === high) return `${low}万`
  return `${low}-${high}万`
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const courseId = Number(id)

  const { data: course, loading: courseLoading } = useQuery(
    () => fetchCourse(courseId),
    [courseId]
  )

  const { data: trainer } = useQuery(
    () => (course ? fetchTrainer(course.trainer_id) : Promise.resolve(null)),
    [course?.trainer_id]
  )

  if (courseLoading) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900">课程未找到</h2>
        <Link to="/courses" className="mt-4 inline-block text-blue-600 hover:underline">
          返回课程列表
        </Link>
      </div>
    )
  }

  const breadcrumbs = courseBreadcrumbs(course.title)
  const courseReviews = getReviewsByCourseId(course.id)

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* 结构化数据 */}
      <JsonLd data={buildCourseSchema(course, trainer)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />

      <div className="mx-auto max-w-5xl">
        {/* 面包屑导航 */}
        <BreadcrumbNav items={breadcrumbs} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 左侧：课程详情 */}
          <div className="lg:col-span-2">
            {/* 课程标题区 */}
            <div>
              {course.category_name && (
                <CategoryBadge name={course.category_name} className="mb-3" />
              )}
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {course.title}
              </h1>
              <p className="mt-3 text-gray-600">{course.description}</p>
            </div>

            {/* 课程大纲 */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">课程大纲</h2>
              <div className="mt-4 space-y-3">
                {course.outline.map((item, index) => {
                  const isGroupTitle = item.startsWith('Day')
                  return isGroupTitle ? (
                    <h3
                      key={index}
                      className="mt-6 text-base font-semibold text-gray-900 first:mt-0"
                    >
                      {item}
                    </h3>
                  ) : (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-3"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 目标受众 */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">适合人群</h2>
              <p className="mt-3 text-gray-600">{course.target_audience}</p>
              <div className="mt-4">
                <ShareButtons title={`${course.title} | TrainHub`} />
              </div>
            </div>

            {/* 课程评价 */}
            <ReviewSection reviews={courseReviews} title="课程评价" />
          </div>

          {/* 右侧：课程信息卡片 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">
              {/* 价格 */}
              <div className="text-center">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPriceRange(course.price_range)}
                </span>
                <span className="text-sm text-gray-500">/场</span>
              </div>

              {/* 课程信息 */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    课程时长
                  </span>
                  <span className="font-medium text-gray-900">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Users className="h-4 w-4" />
                    最大人数
                  </span>
                  <span className="font-medium text-gray-900">{course.max_participants}人</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <DollarSign className="h-4 w-4" />
                    价格区间
                  </span>
                  <span className="font-medium text-gray-900">{course.price_range}元</span>
                </div>
              </div>

              {/* 咨询按钮 */}
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                立即咨询
              </button>

              {/* 培训师信息 */}
              {trainer && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900">授课培训师</h3>
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className="mt-3 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {trainer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{trainer.name}</p>
                      <p className="text-xs text-gray-500">{trainer.title}</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 咨询弹窗 */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        courseId={course.id}
        trainerId={course.trainer_id}
        title={`咨询 - ${course.title}`}
      />
    </div>
  )
}
