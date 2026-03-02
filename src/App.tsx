import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import FloatingContact from '@/components/ui/FloatingContact'
import { usePageTracking } from '@/hooks/usePageTracking'
import HomePage from '@/pages/HomePage'
import TrainersPage from '@/pages/TrainersPage'
import TrainerDetailPage from '@/pages/TrainerDetailPage'
import CoursesPage from '@/pages/CoursesPage'
import CourseDetailPage from '@/pages/CourseDetailPage'
import TopicPage from '@/pages/TopicPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import JoinPage from '@/pages/JoinPage'
import FAQPage from '@/pages/FAQPage'
import AboutPage from '@/pages/AboutPage'

export default function App() {
  usePageTracking()

  return (
    <Layout>
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
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <FloatingContact />
    </Layout>
  )
}
