import { Link } from 'react-router-dom'
import { Star, MapPin, Briefcase } from 'lucide-react'
import type { Trainer } from '@/types'
import { getAvatarUrl } from '@/lib/utils'

interface TrainerCardProps {
  trainer: Trainer
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
  const avatarSrc = trainer.avatar_url || getAvatarUrl(trainer.name, trainer.id)

  return (
    <Link
      to={`/trainers/${trainer.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="p-4 sm:p-5 md:p-6">
        {/* 头部：头像 + 基本信息 */}
        <div className="flex items-start gap-4">
          <img
            src={avatarSrc}
            alt={trainer.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {trainer.name}
            </h3>
            <p className="text-sm text-gray-500">{trainer.title}</p>
          </div>
        </div>

        {/* 评分和位置 */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">{trainer.rating}</span>
            <span>({trainer.review_count}条评价)</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {trainer.city}
          </span>
        </div>

        {/* 经验 */}
        <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
          <Briefcase className="h-4 w-4" />
          <span>{trainer.years_experience}年培训经验</span>
        </div>

        {/* 专长标签 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {trainer.specialties.map(specialty => (
            <span
              key={specialty}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
