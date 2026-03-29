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
  blue: 'border-l-4 border-brand-primary',
  teal: 'border-l-4 border-brand-accent',
  green: 'border-l-4 border-brand-success',
  amber: 'border-l-4 border-brand-warning',
  red: 'border-l-4 border-brand-error',
}

const iconColorClasses = {
  blue: 'bg-blue-100 text-brand-primary',
  teal: 'bg-cyan-100 text-brand-accent',
  green: 'bg-green-100 text-brand-success',
  amber: 'bg-amber-100 text-brand-warning',
  red: 'bg-red-100 text-brand-error',
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
        'bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all',
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{displayValue.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={cn(
                'text-sm font-semibold',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.direction === 'up' ? '+' : '-'}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', iconColorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
