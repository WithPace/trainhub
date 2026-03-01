import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  icon?: string
  variant?: 'default' | 'outline'
  className?: string
}

export default function CategoryBadge({ name, icon, variant = 'default', className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
        variant === 'default'
          ? 'bg-blue-50 text-blue-700'
          : 'border border-gray-300 text-gray-600',
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {name}
    </span>
  )
}
