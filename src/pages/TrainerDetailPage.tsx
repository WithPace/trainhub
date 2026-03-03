import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Briefcase, Mail } from 'lucide-react'
import { getTrainerById as fetchTrainer, getRelatedTrainers, getRelatedCoursesBySpecialties } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import { getAvatarUrl } from '@/lib/utils'
import CourseCard from '@/components/ui/CourseCard'
import TrainerCard from '@/components/ui/TrainerCard'
import InquiryModal from '@/components/ui/InquiryModal'
import ReviewSection from '@/components/ui/ReviewSection'
import ShareButtons from '@/components/ui/ShareButtons'
import { getReviewsByTrainerId } from '@/data/reviews'
import { getRelatedBlogPostsByKeywords } from '@/data/blog-meta'
import RelatedBlogSection from '@/components/ui/RelatedBlogSection'
import PageHead from '@/components/seo/PageHead'
import {
  JsonLd,
  BreadcrumbNav,
  buildPersonSchema,
  buildBreadcrumbSchema,
  trainerBreadcrumbs,
} from '@/components/seo/JsonLd'

export default function TrainerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [courseTab, setCourseTab] = useState<'own' | 'related'>('own')
  const trainerId = Number(id)

  const { data: trainer, loading } = useQuery(
    () => fetchTrainer(trainerId),
    [trainerId]
  )

  const { data: relatedTrainers } = useQuery(
    () =>
      trainer
        ? getRelatedTrainers(trainer.id, trainer.specialties, 3)
        : Promise.resolve([]),
    [trainer?.id, trainer?.specialties]
  )

  // 获取同领域其他培训师的相关课程
  const { data: relatedCourses } = useQuery(
    () =>
      trainer
        ? getRelatedCoursesBySpecialties(trainer.id, trainer.specialties, 3)
        : Promise.resolve([]),
    [trainer?.id, trainer?.specialties]
  )

  if (loading) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900">培训师未找到</h2>
        <Link to="/trainers" className="mt-4 inline-block text-blue-600 hover:underline">
          返回培训师列表
        </Link>
      </div>
    )
  }

  const trainerCourses = trainer.courses ?? []
  const avatarSrc = trainer.avatar_url || getAvatarUrl(trainer.name, trainer.id)
  const breadcrumbs = trainerBreadcrumbs(trainer.name)
  const trainerReviews = getReviewsByTrainerId(trainer.id)

  // 根据培训师专长匹配相关博客文章
  const relatedBlogPosts = getRelatedBlogPostsByKeywords(trainer.specialties, 3)

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <PageHead
        title={`${trainer.name} - ${trainer.title} | TrainHub`}
        description={`${trainer.name}，${trainer.title}，${trainer.city}，${trainer.years_experience}年培训经验。擅长${trainer.specialties.join('、')}。`}
        path={`/trainers/${trainer.id}`}
      />
      {/* 结构化数据 */}
      <JsonLd data={buildPersonSchema(trainer, trainerReviews)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />

      <div className="mx-auto max-w-5xl">
        {/* 面包屑导航 */}
        <BreadcrumbNav items={breadcrumbs} />

        {/* 培训师信息卡片 */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* 头像 */}
            <img
              src={avatarSrc}
              alt={trainer.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />

            {/* 基本信息 */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{trainer.name}</h1>
                  <p className="mt-1 text-gray-500">{trainer.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="shrink-0 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  立即咨询
                </button>
              </div>

              {/* 标签信息 */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:gap-4 sm:text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">{trainer.rating}</span>
                  <span>({trainer.review_count}条评价)</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {trainer.city}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {trainer.years_experience}年经验
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {trainer.contact_email}
                </span>
              </div>

              {/* 专长标签 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {trainer.specialties.map(specialty => (
                  <span
                    key={specialty}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 个人简介 */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">个人简介</h2>
            <p className="mt-3 leading-relaxed text-gray-600">{trainer.bio}</p>
            <div className="mt-4">
              <ShareButtons title={`${trainer.name} - ${trainer.title} | TrainHub`} />
            </div>
          </div>
        </div>

        {/* 课程 Tab 切换 */}
        <div className="mt-10">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setCourseTab('own')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                courseTab === 'own'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              开设课程（{trainerCourses.length}门）
            </button>
            {relatedCourses && relatedCourses.length > 0 && (
              <button
                type="button"
                onClick={() => setCourseTab('related')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  courseTab === 'related'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                同领域推荐（{relatedCourses.length}门）
              </button>
            )}
          </div>

          {/* Tab 内容 */}
          {courseTab === 'own' ? (
            trainerCourses.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {trainerCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-gray-500">暂无课程</p>
            )
          ) : (
            relatedCourses && relatedCourses.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )
          )}
        </div>

        {/* 学员评价 */}
        <ReviewSection reviews={trainerReviews} />

        {/* 相关博客文章 */}
        {relatedBlogPosts.length > 0 && (
          <RelatedBlogSection posts={relatedBlogPosts} title="相关培训干货" />
        )}
      </div>

      {/* 同领域培训师推荐 */}
      {relatedTrainers && relatedTrainers.length > 0 && (
        <section className="mt-12 border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-bold text-gray-900">同领域培训师</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedTrainers.map((t) => (
                <TrainerCard key={t.id} trainer={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 咨询弹窗 */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        trainerId={trainer.id}
        title={`咨询 - ${trainer.name}`}
      />
    </div>
  )
}
