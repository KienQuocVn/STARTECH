'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

const messages = [
  'Đang chuẩn bị trải nghiệm',
  'Đang tối ưu giao diện',
  'Đang hoàn thiện nội dung',
]

export function GlobalLoader() {
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current
        const step = current < 48 ? 8 : current < 74 ? 5 : 2
        return Math.min(current + step, 92)
      })
    }, 140)

    return () => window.clearInterval(timer)
  }, [])

  const message = useMemo(() => {
    if (progress < 36) return messages[0]
    if (progress < 68) return messages[1]
    return messages[2]
  }, [progress])

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(198,227,255,0.92),_rgba(255,255,255,0.98)_42%,_#ffffff_78%)]">
      <div className="absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full bg-[#c6e3ff]/35 blur-3xl" />
      <div className="absolute bottom-[-8%] right-[-4%] h-72 w-72 rounded-full bg-[#49b1ff]/12 blur-3xl" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_48px_rgba(73,177,255,0.14)] backdrop-blur"
          >
            <Image src="/favicon.png" alt="StarTech" width={52} height={52} className="h-11 w-auto object-contain" priority />
          </motion.div>

          <div className="mt-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[#1a63a8]/70">StarTech</div>
            <div className="mt-3 text-xl font-semibold text-[#153b4a] sm:text-2xl">{message}<span className="loader-dots" /></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
          className="absolute bottom-10 w-full max-w-md px-2 sm:bottom-14"
        >
          <div className="rounded-[28px] border border-white/80 bg-white/85 px-5 py-5 shadow-[0_18px_44px_rgba(26,99,168,0.1)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[#3b6676]">{message}</span>
              <span className="text-sm font-semibold text-[#1a63a8]">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-[#c6e3ff]/35 [&>[data-slot=progress-indicator]]:bg-[#49b1ff]" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
