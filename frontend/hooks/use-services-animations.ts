'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Custom Hook: useServicesAnimations
 *
 * Chức năng: Chứa tất cả các animation nâng cao dành riêng cho trang Dịch vụ / Thiết kế website
 * Bao gồm:
 *   - Stagger animation cho grid items
 *   - Counter animation (tăng số dần)
 *   - Price counter (định dạng tiền Việt Nam)
 *   - Parallax effect khi scroll
 *   - Tilt effect (xoay thẻ khi di chuột)
 */
export function useServicesAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Stagger animation cho các grid/section
    const grids = Array.from(document.querySelectorAll<HTMLElement>('[data-stagger]'));
    const gridTweens: gsap.core.Tween[] = [];

    grids.forEach((grid) => {
      const items = Array.from(grid.children) as HTMLElement[];
      const t = gsap.fromTo(
        items,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: grid, start: 'top 85%' },
        },
      );
      gridTweens.push(t);
    });

    // 2. Counter animation cho giá tiền (định dạng VNĐ)
    const prices = Array.from(document.querySelectorAll<HTMLElement>('[data-price]'));
    const priceTweens: gsap.core.Tween[] = [];
    const formatVN = (n: number) => n.toLocaleString('vi-VN').replace(/,/g, '.');

    prices.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || 0);
      const obj = { val: 0 };

      const t = gsap.to(obj, {
        val: target,
        duration: 1.2,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = formatVN(Math.floor(obj.val));
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
      priceTweens.push(t);
    });

    // 3. Counter animation thông thường (số liệu thống kê)
    const counts = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    const countTweens: gsap.core.Tween[] = [];

    counts.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || 0);
      const pad = Number(el.getAttribute('data-pad') || 0);
      const obj = { val: 0 };

      const t = gsap.to(obj, {
        val: target,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          const v = Math.floor(obj.val).toString().padStart(pad, '0');
          el.textContent = v;
        },
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      });
      countTweens.push(t);
    });

    // 4. Parallax effect
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const parallaxTweens: gsap.core.Tween[] = [];

    cards.forEach((card) => {
      const t = gsap.to(card, {
        y: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
      parallaxTweens.push(t);
    });

    // 5. 3D Tilt effect khi di chuột
    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
    const cleanupTilt: Array<() => void> = [];

    tiltCards.forEach((card) => {
      const max = 6;
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);

        gsap.to(card, {
          rotateY: dx * max,
          rotateX: -dy * max,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power3.out',
        });
      };

      const leave = () =>
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });

      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);

      cleanupTilt.push(() => {
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      });
    });

    // Cleanup tất cả animation khi component unmount
    return () => {
      gridTweens.forEach((t) => t.kill());
      priceTweens.forEach((t) => t.kill());
      countTweens.forEach((t) => t.kill());
      parallaxTweens.forEach((t) => t.kill());
      cleanupTilt.forEach((fn) => fn());
    };
  }, []);
}
