'use client';

import { useEffect } from 'react';
import type { Product, ProductCategory } from '@/lib/services/product';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
import DetailGallerySection from './sections/detail-gallery-section';
import DetailOverviewSection from './sections/detail-overview-section';
import DetailStatsSection from './sections/detail-stats-section';

interface ProjectDetailPageClientProps {
  project: Product;
  categories: ProductCategory[];
}

export default function ProjectDetailPageClient({ project, categories }: ProjectDetailPageClientProps) {
  useGsapReveal();

  useEffect(() => {
    const countUpElements = document.querySelectorAll('[data-count-up]');
    const priceElements = document.querySelectorAll('[data-price-count]');

    const animateCountUp = (element: Element) => {
      const target = Number(element.getAttribute('data-target') || 0);
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = Date.now();

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(target * easeOutQuart);

        element.textContent = currentValue.toLocaleString('vi-VN') + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    };

    const animatePrice = (element: Element) => {
      const target = Number(element.getAttribute('data-target') || 0);
      const duration = 2500;
      const startTime = Date.now();

      const updatePrice = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(target * easeOutQuart);

        element.textContent = currentValue.toLocaleString('vi-VN');

        if (progress < 1) {
          requestAnimationFrame(updatePrice);
        }
      };

      updatePrice();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.hasAttribute('data-count-up')) {
              animateCountUp(entry.target);
            } else if (entry.target.hasAttribute('data-price-count')) {
              animatePrice(entry.target);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    countUpElements.forEach((el) => observer.observe(el));
    priceElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <DetailGallerySection project={project} />
      <DetailStatsSection project={project} />
      <DetailOverviewSection project={project} categories={categories} />
    </div>
  );
}
