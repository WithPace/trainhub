import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import TrainerCard from '@/components/ui/TrainerCard'
import type { Trainer } from '@/types'

interface FeaturedTrainersSectionProps {
  trainers: Trainer[] | null
}

export default function FeaturedTrainersSection({ trainers }: FeaturedTrainersSectionProps) {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">精选培训师</h2>
            <p className="mt-1 text-gray-500">经过严格筛选的行业专家</p>
          </div>
          <Link
            to="/trainers"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(trainers ?? []).map(trainer => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      </div>
    </section>
  )
}
