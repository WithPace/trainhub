import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCourses, getCategories } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import CourseCard from '@/components/ui/CourseCard'
import SearchBar from '@/components/ui/SearchBar'

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const initialCategory = searchParams.get('category') ?? ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const { data: allCourses, loading } = useQuery(() => getCourses(), [])
  const { data: categories } = useQuery(() => getCategories(), [])

  // 更新 URL 搜索参数
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug)
    const params = new URLSearchParams()
    if (slug) params.set('category', slug)
    if (searchQuery) params.set('q', searchQuery)
    setSearchParams(params)
  }

  // 客户端筛选
  const filteredCourses = useMemo(() => {
    if (!allCourses) return []
    return allCourses.filter(course => {
      const matchesSearch =
        !searchQuery ||
        course.title.includes(searchQuery) ||
        course.description.includes(searchQuery) ||
        (course.trainer_name && course.trainer_name.includes(searchQuery))

      const matchesCategory =
        !selectedCategory || course.category_slug === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [allCourses, searchQuery, selectedCategory])

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* 标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">培训课程</h1>
          <p className="mt-2 text-gray-500">
            浏览各领域精品课程，找到最适合您团队的培训方案
          </p>
        </div>

        {/* 搜索 */}
        <div className="mt-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索课程名称、培训师..."
          />
        </div>

        {/* 分类标签筛选 */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {(categories ?? []).map(cat => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 结果计数 */}
        <p className="mt-6 text-sm text-gray-500">
          {loading ? '加载中...' : `共 ${filteredCourses.length} 门课程`}
        </p>

        {/* 课程列表 */}
        {filteredCourses.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : !loading ? (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">没有找到匹配的课程</p>
            <p className="mt-2 text-sm text-gray-400">请尝试调整搜索条件或分类筛选</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
