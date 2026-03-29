"use client"

import { useEffect, useRef } from "react"

export default function GlobalFX() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      bar.style.width = `${progress}%`
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed left-0 top-0 z-[9997] h-[3px] w-full bg-transparent">
        <div
          ref={barRef}
          className="h-full w-0 bg-cyan-400/90 shadow-[0_0_20px_rgba(56,189,248,0.8)]"
          style={{ transition: "width 0.08s linear" }}
        />
      </div>
      {/* Global custom cursor */}
    </>
  )
}


