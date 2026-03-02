import { useState, useMemo } from 'react'
import { getTrainers, getAllCities, getAllSpecialties } from '@/services/api'
import { useQuery } from '@/hooks/useQuery'
import TrainerCard from '@/components/ui/TrainerCard'
import SearchBar from '@/components/ui/SearchBar'
import PageHead from '@/components/seo/PageHead'

const experienceRanges = [
  { label: '全部经验', min: 0, max: Infinity },
  { label: '10年以下', min: 0, max: 10 },
  { label: '10-15年', min: 10, max: 15 },
  { label: '15年以上', min: 15, max: Infinity },
]

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedExpRange, setSelectedExpRange] = useState(0) // index into experienceRanges

  const { data: allTrainers, loading } = useQuery(() => getTrainers(), [])
  const { data: cities } = useQuery(() => getAllCities(), [])
  const { data: specialties } = useQuery(() => getAllSpecialties(), [])

  // 客户端筛选（数据量小，无需服务端筛选）
  const filteredTrainers = useMemo(() => {
    if (!allTrainers) return []
    const expRange = experienceRanges[selectedExpRange]

    return allTrainers.filter(trainer => {
      const matchesSearch =
        !searchQuery ||
        trainer.name.includes(searchQuery) ||
        trainer.title.includes(searchQuery) ||
        trainer.bio.includes(searchQuery) ||
        trainer.specialties.some(s => s.includes(searchQuery))

      const matchesCity = !selectedCity || trainer.city === selectedCity

      const matchesSpecialty =
        !selectedSpecialty || trainer.specialties.includes(selectedSpecialty)

      const matchesExp =
        selectedExpRange === 0 ||
        (trainer.years_experience >= expRange.min && trainer.years_experience < expRange.max)

      return matchesSearch && matchesCity && matchesSpecialty && matchesExp
    })
  }, [allTrainers, searchQuery, selectedCity, selectedSpecialty, selectedExpRange])

  const selectClass = 'rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <PageHead
        title="培训师 | TrainHub - 严选企业培训专家"
        description="浏览 TrainHub 严格筛选的专业培训师，按城市、专长、经验筛选，找到最适合您企业的培训专家。"
        path="/trainers"
      />
      <div className="mx-auto max-w-7xl">
        {/* 标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">培训师</h1>
          <p className="mt-2 text-gray-500">
            浏览我们严格筛选的专业培训师，找到最适合您企业的专家
          </p>
        </div>

        {/* 搜索与筛选 */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索培训师姓名、专长..."
            className="flex-1 sm:min-w-[240px]"
          />
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className={selectClass}
          >
            <option value="">全部城市</option>
            {(cities ?? []).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
            className={selectClass}
          >
            <option value="">全部专长</option>
            {(specialties ?? []).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={selectedExpRange}
            onChange={e => setSelectedExpRange(Number(e.target.value))}
            className={selectClass}
          >
            {experienceRanges.map((range, i) => (
              <option key={i} value={i}>{range.label}</option>
            ))}
          </select>
        </div>

        {/* 结果计数 + 重置按钮 */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? '加载中...' : `共 ${filteredTrainers.length} 位培训师`}
          </p>
          {(searchQuery || selectedCity || selectedSpecialty || selectedExpRange !== 0) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCity('')
                setSelectedSpecialty('')
                setSelectedExpRange(0)
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              清除筛选
            </button>
          )}
        </div>

        {/* 培训师列表 */}
        {filteredTrainers.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrainers.map(trainer => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        ) : !loading ? (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">没有找到匹配的培训师</p>
            <p className="mt-2 text-sm text-gray-400">请尝试调整搜索条件</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
