'use client'

import { ReactNode, useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: number
  icon: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  color?: 'blue' | 'teal' | 'green' | 'amber' | 'red'
}

const colorClasses = {
  blue: 'border-l-4 border-[var(--brand-primary)]',
  teal: 'border-l-4 border-[var(--brand-secondary)]',
  green: 'border-l-4 border-[var(--status-success)]',
  amber: 'border-l-4 border-[var(--status-warning)]',
  red: 'border-l-4 border-[var(--status-danger)]',
}

const iconColorClasses = {
  blue: 'bg-[var(--surface-accent)] text-[var(--brand-primary)]',
  teal: 'bg-[var(--surface-accent)] text-[var(--brand-secondary)]',
  green: 'status-success-soft',
  amber: 'status-warning-soft',
  red: 'status-danger-soft',
}

export function KPICard({ 
  label, 
  value, 
  icon, 
  trend, 
  color = 'blue' 
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let animationFrameId: number
    let currentValue = 0
    const increment = value / 40

    const animate = () => {
      currentValue += increment
      if (currentValue >= value) {
        setDisplayValue(value)
      } else {
        setDisplayValue(Math.floor(currentValue))
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [value])

  return (
    <div
      className={cn(
        'admin-panel rounded-lg p-6 transition-all hover:-translate-y-0.5',
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-[var(--text-muted)]">{label}</p>
          <p className="mb-3 text-3xl font-bold text-[var(--text-strong)]">{displayValue.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' ? (
                <TrendingUp size={16} className="text-[var(--status-success)]" />
              ) : (
                <TrendingDown size={16} className="text-[var(--status-danger)]" />
              )}
              <span className={cn(
                'text-sm font-semibold',
                trend.direction === 'up' ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'
              )}>
                {trend.direction === 'up' ? '+' : '-'}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg', iconColorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
