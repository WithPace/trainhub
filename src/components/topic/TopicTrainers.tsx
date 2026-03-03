import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import TrainerCard from '@/components/ui/TrainerCard'
import type { Trainer } from '@/types'

interface TopicTrainersProps {
  categoryName: string
  trainers: Trainer[]
}

export default function TopicTrainers({ categoryName, trainers }: TopicTrainersProps) {
  if (trainers.length === 0) return null

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{categoryName}领域培训师</h2>
            <p className="mt-1 text-gray-500">经验丰富的{categoryName}培训专家</p>
          </div>
          <Link
            to="/trainers"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map(trainer => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      </div>
    </section>
  )
}
