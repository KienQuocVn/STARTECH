import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'new' | 'processing' | 'completed' | 'draft' | 'published'
  animate?: boolean
}

const statusConfig = {
  new: {
    label: 'Mới',
    color: 'bg-blue-100 text-blue-700',
  },
  processing: {
    label: 'Đang xử lý',
    color: 'bg-amber-100 text-amber-700',
  },
  completed: {
    label: 'Hoàn tất',
    color: 'bg-green-100 text-green-700',
  },
  draft: {
    label: 'Nháp',
    color: 'bg-gray-100 text-gray-700',
  },
  published: {
    label: 'Đã công bố',
    color: 'bg-green-100 text-green-700',
  },
}

export function StatusBadge({ status, animate }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
        config.color,
        animate && status === 'new' && 'animate-pulse-dot'
      )}
    >
      {config.label}
    </span>
  )
}
