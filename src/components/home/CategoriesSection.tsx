import { Link } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoriesSectionProps {
  categories: Category[] | null
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">培训领域</h2>
          <p className="mt-2 text-gray-500">覆盖企业培训核心领域</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(categories ?? []).map(cat => (
            <Link
              key={cat.id}
              to={`/topics/${cat.slug}`}
              className="group rounded-xl border border-gray-200 p-4 text-center transition-all hover:border-blue-300 hover:shadow-md sm:p-6"
            >
              <span className="text-4xl">{cat.icon}</span>
              <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600">
                {cat.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
