'use client'

import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

export function SlideOver({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: SlideOverProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn('relative z-10 w-full rounded-[28px] border border-slate-200 bg-white shadow-2xl', sizeClasses[size])}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin modal</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
