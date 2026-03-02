import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCourses, getCategories } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import CourseCard from '@/components/ui/CourseCard'
import SearchBar from '@/components/ui/SearchBar'
import PageHead from '@/components/seo/PageHead'

/** 从 "30000-50000" 格式的 price_range 中提取最低价 */
function getMinPrice(priceRange: string): number {
  const low = priceRange.split('-')[0]
  return parseInt(low, 10) || 0
}

const priceRanges = [
  { label: '全部价格', min: 0, max: Infinity },
  { label: '2万以下', min: 0, max: 20000 },
  { label: '2-4万', min: 20000, max: 40000 },
  { label: '4万以上', min: 40000, max: Infinity },
]

const durationOptions = [
  { label: '全部时长', value: '' },
  { label: '半天/1天', value: '1' },
  { label: '2天', value: '2' },
]

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const initialCategory = searchParams.get('category') ?? ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState('')

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
    const priceRange = priceRanges[selectedPriceRange]

    return allCourses.filter(course => {
      const matchesSearch =
        !searchQuery ||
        course.title.includes(searchQuery) ||
        course.description.includes(searchQuery) ||
        (course.trainer_name && course.trainer_name.includes(searchQuery))

      const matchesCategory =
        !selectedCategory || course.category_slug === selectedCategory

      const minPrice = getMinPrice(course.price_range)
      const matchesPrice =
        selectedPriceRange === 0 ||
        (minPrice >= priceRange.min && minPrice < priceRange.max)

      const matchesDuration =
        !selectedDuration ||
        (selectedDuration === '1' && course.duration.includes('1天')) ||
        (selectedDuration === '1' && course.duration.includes('半天')) ||
        (selectedDuration === '2' && course.duration.includes('2天'))

      return matchesSearch && matchesCategory && matchesPrice && matchesDuration
    })
  }, [allCourses, searchQuery, selectedCategory, selectedPriceRange, selectedDuration])

  const hasFilters = searchQuery || selectedCategory || selectedPriceRange !== 0 || selectedDuration
  const selectClass = 'rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <PageHead
        title="培训课程 | TrainHub - 各领域精品企业培训课程"
        description="浏览各领域精品课程，按分类、价格、时长筛选，找到最适合您团队的培训方案。"
        path="/courses"
      />
      <div className="mx-auto max-w-7xl">
        {/* 标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">培训课程</h1>
          <p className="mt-2 text-gray-500">
            浏览各领域精品课程，找到最适合您团队的培训方案
          </p>
        </div>

        {/* 搜索 + 筛选 */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索课程名称、培训师..."
            className="flex-1 sm:min-w-[240px]"
          />
          <select
            value={selectedPriceRange}
            onChange={e => setSelectedPriceRange(Number(e.target.value))}
            className={selectClass}
          >
            {priceRanges.map((range, i) => (
              <option key={i} value={i}>{range.label}</option>
            ))}
          </select>
          <select
            value={selectedDuration}
            onChange={e => setSelectedDuration(e.target.value)}
            className={selectClass}
          >
            {durationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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

        {/* 结果计数 + 重置 */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? '加载中...' : `共 ${filteredCourses.length} 门课程`}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
                setSelectedPriceRange(0)
                setSelectedDuration('')
                setSearchParams({})
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              清除筛选
            </button>
          )}
        </div>

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
