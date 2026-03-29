'use client';

import { useEffect, useRef, useState } from 'react';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProducts, getProductsByCategory, type Product, type ProductCategory } from '@/lib/services/product';
import { Hero } from './sections/hero-section';
import ProjectsSection from './sections/projects-section';
import FeedbackSection from './sections/feedback-section';
import CTASection from './sections/cta-section';

interface ProjectsPageClientProps {
  initialProducts: Product[];
  initialCategories: Array<ProductCategory & { product_count: number }>;
  initialTotalItems: number;
  initialTotalPages: number;
  totalAllItems: number;
}

export default function ProjectsPageClient({
  initialProducts,
  initialCategories,
  initialTotalItems,
  initialTotalPages,
  totalAllItems,
}: ProjectsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<(ProductCategory & { product_count: number })[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const isInitialFetch = useRef(true);

  useGsapReveal();
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (isInitialFetch.current && activeCategory === 'all' && currentPage === 1) {
      isInitialFetch.current = false;
      return;
    }

    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let productsResponse;
        if (activeCategory !== 'all') {
          const match = activeCategory.match(/^cat-(\d+)$/);
          const catId = match ? Number(match[1]) : null;

          productsResponse = catId
            ? await getProductsByCategory(catId, { page: currentPage, limit: 12 })
            : await getProducts({ page: currentPage, limit: 12 });
        } else {
          productsResponse = await getProducts({ page: currentPage, limit: 12 });
        }

        if (!mounted) return;

        const total = productsResponse?.data?.total ?? 0;
        setProducts(productsResponse?.data?.items || []);
        setTotalItems(total);
        setTotalPages(Math.max(1, Math.ceil(total / 12)));
      } catch (error) {
        console.error('Loi khi tai danh sach du an:', error);
        if (!mounted) return;
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [currentPage, activeCategory]);

  useEffect(() => {
    const nums = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-count]'));
    const tweens: gsap.core.Tween[] = [];
    nums.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || 0);
      const obj = { val: 0 };
      const t = gsap.to(obj, {
        val: target,
        duration: 1.2,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toString() + (el.dataset.suffix || '');
        },
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      });
      tweens.push(t);
    });

    const grid = document.querySelector<HTMLElement>('[data-project-grid]');
    if (grid) {
      const items = Array.from(grid.children) as HTMLElement[];
      gsap.fromTo(
        items,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: grid, start: 'top 85%' },
        },
      );
    }

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const parallaxTweens: gsap.core.Tween[] = [];
    cards.forEach((card) => {
      const t = gsap.to(card, {
        y: -12,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      parallaxTweens.push(t);
    });

    const priceEls = Array.from(document.querySelectorAll<HTMLElement>('[data-price-project]'));
    const formatVN = (n: number) => n.toLocaleString('vi-VN').replace(/,/g, '.');
    const priceTweens: gsap.core.Tween[] = [];
    priceEls.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || 0);
      const obj = { val: 0 };
      const t = gsap.to(obj, {
        val: target,
        duration: 1.1,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = formatVN(Math.floor(obj.val));
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
      priceTweens.push(t);
    });

    const statsEls = Array.from(document.querySelectorAll<HTMLElement>('[data-stats-count]'));
    const statsTweens: gsap.core.Tween[] = [];
    statsEls.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || 0);
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { val: 0 };
      const t = gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toString() + suffix;
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
      statsTweens.push(t);
    });

    const techEls = Array.from(document.querySelectorAll<HTMLElement>('[data-tech-count]'));
    const techTweens: gsap.core.Tween[] = [];
    techEls.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || 0);
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { val: 0 };
      const t = gsap.to(obj, {
        val: target,
        duration: 1.2,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toString() + suffix;
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
      techTweens.push(t);
    });

    const group = document.querySelector<HTMLElement>('[data-star-group]');
    if (group) {
      const input = group.querySelector<HTMLInputElement>('input[name="rating"]');
      const stars = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-star]'));
      const paint = (val: number) => {
        stars.forEach((s) => {
          const n = Number(s.dataset.star);
          s.style.color = n <= val ? '#f59e0b' : '#d1d5db';
        });
      };
      paint(Number(input?.value || 5));
      const onClick = (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const val = Number(target.dataset.star);
        if (!isNaN(val) && input) {
          input.value = String(val);
          paint(val);
        }
      };
      group.addEventListener('click', onClick);
      return () => {
        group.removeEventListener('click', onClick);
      };
    }

    return () => {
      tweens.forEach((t) => t.kill());
      parallaxTweens.forEach((t) => t.kill());
      priceTweens.forEach((t) => t.kill());
      statsTweens.forEach((t) => t.kill());
      techTweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectsSection
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        totalAllItems={totalAllItems}
      />
      <FeedbackSection />
      <CTASection />
    </div>
  );
}
