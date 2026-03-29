"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Đăng ký plugin ScrollTrigger một lần
gsap.registerPlugin(ScrollTrigger)

/**
 * Custom Hook: useGsapReveal
 * 
 * Chức năng: Tạo hiệu ứng reveal (hiện dần) khi scroll cho các phần tử
 * Cách sử dụng: Thêm thuộc tính data-reveal vào element muốn animate
 * 
 * Ví dụ:
 * <div data-reveal data-delay="200" data-y="40">Nội dung</div>
 */
export function useGsapReveal(selector: string = "[data-reveal]") {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!elements.length) return

    const animations: Array<gsap.core.Tween | gsap.core.Timeline> = []

    elements.forEach((el) => {
      const delay = Number(el.dataset.delay || 0)
      const y = Number(el.dataset.y || 24)
      const opacity = Number(el.dataset.opacity || 0)

      const tween = gsap.fromTo(
        el,
        { y, opacity },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",           // Bắt đầu animate khi phần tử cách top viewport 85%
            toggleActions: "play none none reverse",
          },
        }
      )
      animations.push(tween)
    })

    // Cleanup khi component unmount
    return () => {
      animations.forEach((a) => a?.kill())
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [selector])
}