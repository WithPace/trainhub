import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CourseCard from '@/components/ui/CourseCard'
import type { Course } from '@/types'

interface FeaturedCoursesSectionProps {
  courses: Course[] | null
}

export default function FeaturedCoursesSection({ courses }: FeaturedCoursesSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">热门课程</h2>
            <p className="mt-1 text-gray-500">最受企业欢迎的培训课程</p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(courses ?? []).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
