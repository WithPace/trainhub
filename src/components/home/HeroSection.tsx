import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'

interface HeroSectionProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
          企业培训采购，告别中间商加价
        </h1>
        <p className="mt-4 text-lg text-blue-100 sm:text-xl">
          直接对接实战派培训师，课程大纲·价格区间·学员评价全透明。3分钟智能匹配，从需求到落地一站搞定
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="搜索培训师、课程或专业领域..."
            className="[&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-blue-200"
          />
        </div>
        {searchQuery && (
          <div className="mt-4">
            <Link
              to={`/courses?q=${encodeURIComponent(searchQuery)}`}
              className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white"
            >
              查看搜索结果 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
