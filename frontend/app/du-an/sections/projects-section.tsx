'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Filter, X } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/services/product';
import Image from 'next/image';

interface ProjectsSectionProps {
  products: Product[];
  categories: Array<ProductCategory & { product_count: number }>;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  totalAllItems: number;
}

function formatPrice(price: unknown) {
  if (price === null || price === undefined) return null;
  const asString = String(price);
  const digits = asString.replace(/\D/g, '');
  if (!digits) return null;
  const num = Number(digits);
  return num.toLocaleString('vi-VN');
}

export default function ProjectsSection(props: ProjectsSectionProps) {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalAllItems,
  } = props;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categoriesWithAll = useMemo(() => {
    return [
      { id: 'all', label: 'Tất cả', count: totalAllItems },
      ...categories.map((cat) => ({
        id: `cat-${cat.id}`,
        label: cat.name,
        count: cat.product_count || 0,
      })),
    ];
  }, [categories, totalAllItems]);

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  return (
    <section id="projects" className="bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 text-center"
        />

        <div className="mb-6 lg:hidden">
          <Card className="border border-white/20 bg-white/85 shadow-lg backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                  <div className="rounded-lg bg-[#1a63a8]/10 p-2">
                    <Filter className="h-5 w-5 text-[#1a63a8]" />
                  </div>
                  Mẫu website
                </CardTitle>

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1a63a8]/20 bg-white text-[#1a63a8] shadow-sm transition-all duration-300 hover:bg-[#1a63a8] hover:text-white"
                  aria-label="Mở bộ lọc mẫu website"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm text-[#244454]">
                <span className="line-clamp-1 font-medium">
                  {categoriesWithAll.find((category) => category.id === activeCategory)?.label ?? 'Tất cả'}
                </span>
                <span className="rounded-full bg-[#1a63a8]/10 px-2 py-0.5 text-xs font-semibold text-[#1a63a8]">
                  {categoriesWithAll.find((category) => category.id === activeCategory)?.count ?? totalAllItems}
                </span>
              </div>
            </CardContent>
          </Card>

          <div
            className={`fixed inset-0 z-[70] transition-all duration-300 ${
              isMobileFilterOpen ? 'pointer-events-auto bg-black/35 opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden={!isMobileFilterOpen}
          />

          <div
            className={`fixed inset-y-0 right-0 z-[80] w-[88vw] max-w-sm transform border-l border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-500 ${
              isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden={!isMobileFilterOpen}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#1a63a8]/10 p-2">
                    <Filter className="h-5 w-5 text-[#1a63a8]" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-900">Bộ lọc mẫu website</div>
                    <div className="text-sm text-slate-500">Chọn danh mục để xem đúng mẫu phù hợp</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-3">
                  {categoriesWithAll.map((category) => {
                    const isActive = activeCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategorySelect(category.id)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-[#1a63a8] bg-[#1a63a8] text-white shadow-lg'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#1a63a8]/35 hover:bg-[#1a63a8]/5'
                        }`}
                      >
                        <span className="pr-3 text-sm font-medium">{category.label}</span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#1a63a8]/10 text-[#1a63a8]'
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="hidden flex-shrink-0 lg:block lg:w-72"
          >
            <Card className="sticky top-20 border border-white/20 bg-white/80 shadow-xl backdrop-blur-xl dark:bg-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="rounded-lg bg-[#1a63a8]/10 p-2">
                    <Filter className="h-5 w-5 text-[#1a63a8]" />
                  </div>
                  Danh Mục Dự Án
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoriesWithAll.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                  >
                    <Button
                      variant={activeCategory === category.id ? 'default' : 'ghost'}
                      className={`h-12 w-full justify-between rounded-xl transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-[#1a63a8] text-white shadow-lg hover:bg-[#1a63a8]/90'
                          : 'hover:scale-[1.02] hover:bg-muted/50'
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <span className="font-medium">{category.label}</span>
                      <Badge
                        variant={activeCategory === category.id ? 'secondary' : 'outline'}
                        className={`ml-2 ${
                          activeCategory === category.id
                            ? 'border-white/30 bg-white/20 text-white'
                            : 'border-[#1a63a8]/20 bg-[#1a63a8]/10 text-[#1a63a8]'
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" data-project-grid>
              {loading
                ? null
                : products.length === 0
                ? null
                : products.map((project, index) => {
                    const formattedPrice = formatPrice(project.price);

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.06 }}
                        whileHover={{ y: -8 }}
                        className="group h-full"
                      >
                        <Card
                          data-parallax
                          className="h-full overflow-hidden border border-white/20 bg-white/80 transition-all duration-500 hover:shadow-2xl dark:bg-white/10 backdrop-blur-xl"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={project.image_url || '/placeholder.svg'}
                              alt={project.name || 'Project image'}
                              width={800}
                              height={500}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              priority={false}
                              quality={90}
                              unoptimized={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="absolute left-4 top-4 flex gap-2">
                              {(project.product_category || []).slice(0, 2).map((pc, i) => (
                                <Badge
                                  key={pc?.category?.id ?? `pc-${i}`}
                                  className="bg-[#1a63a8] text-white shadow-lg"
                                >
                                  {pc?.category?.name ?? '-'}
                                </Badge>
                              ))}
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <Button
                                asChild
                                size="sm"
                                className="bg-white/90 text-[#1a63a8] shadow-lg hover:bg-white"
                              >
                                <Link href={`/du-an/${project.slug || project.id}`}>
                                  Xem chi tiết
                                  <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>

                          <CardHeader className="pb-4">
                            <CardTitle className="min-h-[3.5rem] text-xl leading-snug transition-colors duration-300 line-clamp-2 group-hover:text-[#1a63a8]">
                              {project.name}
                            </CardTitle>
                            <div className="flex items-center justify-between gap-3">
                              <span className="line-clamp-1 text-sm font-medium text-muted-foreground">
                                {project.product_category?.[0]?.category?.name ?? 'Danh mục khác'}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-yellow-400"
                                  >
                                    <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.6 24 12 20.013 4.4 24l1.9-8.694L.6 9.75l7.732-1.732L12 .587z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="flex h-[calc(100%-22rem)] flex-col pt-0">
                            <p className="mb-6 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {project.description ?? 'Không có mô tả chi tiết về dự án này.'}
                            </p>
                            <div className="mt-auto flex items-center justify-between border-t border-muted/50 pt-4">
                              <div>
                                <div className="mb-1 text-xs text-muted-foreground">Giá trị dự án</div>
                                <div className="text-2xl font-bold text-[#1a63a8]">
                                  {formattedPrice ? `${formattedPrice} VNĐ` : 'Liên hệ'}
                                </div>
                              </div>
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-[#1a63a8]/30 text-[#1a63a8] transition-all duration-300 hover:bg-[#1a63a8] hover:text-white"
                              >
                                <Link href={project.demo_url || '#'} target="_blank" rel="noopener noreferrer">
                                  XEM DEMO
                                  <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
            </div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 flex justify-center gap-3"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.div key={page} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className={`h-10 w-10 rounded-full transition-all duration-300 ${
                        page === currentPage
                          ? 'bg-[#1a63a8] text-white shadow-lg hover:bg-[#1a63a8]/90'
                          : 'border-[#1a63a8]/30 text-[#1a63a8] hover:border-[#1a63a8]/50 hover:bg-[#1a63a8]/10'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
