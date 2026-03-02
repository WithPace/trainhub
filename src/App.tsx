import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import FloatingContact from '@/components/ui/FloatingContact'
import { usePageTracking } from '@/hooks/usePageTracking'
// HomePage 同步加载 — 首屏 LCP 关键路径
import HomePage from '@/pages/HomePage'

// 其余页面按路由懒加载，blog 内容由 BlogPostPage 按需动态加载
const TrainersPage = lazy(() => import('@/pages/TrainersPage'))
const TrainerDetailPage = lazy(() => import('@/pages/TrainerDetailPage'))
const CoursesPage = lazy(() => import('@/pages/CoursesPage'))
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'))
const TopicPage = lazy(() => import('@/pages/TopicPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const JoinPage = lazy(() => import('@/pages/JoinPage'))
const FAQPage = lazy(() => import('@/pages/FAQPage'))
const MatchPage = lazy(() => import('@/pages/MatchPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const AssessmentPage = lazy(() => import('@/pages/AssessmentPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

/** 页面加载占位 — 轻量 skeleton，避免布局闪烁 */
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

export default function App() {
  usePageTracking()

  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics/:slug" element={<TopicPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/trainers/:id" element={<TrainerDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <FloatingContact />
    </Layout>
  )
}
