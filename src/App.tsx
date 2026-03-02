import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import TrainersPage from '@/pages/TrainersPage'
import TrainerDetailPage from '@/pages/TrainerDetailPage'
import CoursesPage from '@/pages/CoursesPage'
import CourseDetailPage from '@/pages/CourseDetailPage'
import JoinPage from '@/pages/JoinPage'
import AboutPage from '@/pages/AboutPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/trainers/:id" element={<TrainerDetailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  )
}
