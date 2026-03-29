'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Product, ProductCategory } from '@/lib/services/product';

interface DetailOverviewSectionProps {
  project: Product;
  categories: ProductCategory[];
}

export default function DetailOverviewSection({ project }: DetailOverviewSectionProps) {
  // Tìm danh mục chính từ product_category (nếu có)
  const mainCategory = project.product_category?.[0]?.category;
  const priceValue =
    typeof project.price === 'number'
      ? project.price.toLocaleString('vi-VN') + ' VNĐ'
      : typeof project.price === 'string' && project.price.trim() !== ''
      ? project.price
      : 'Liên hệ';

  const ratingValue =
    typeof project.rating === 'number'
      ? project.rating.toFixed(1)
      : project.rating || 'Chưa có đánh giá';

  return (
    <section id="overview" className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1a63a8]/20 bg-[#1a63a8]/10 px-4 py-2 backdrop-blur mb-6">
            <div className="h-2 w-2 rounded-full bg-[#1a63a8] animate-pulse" />
            <span className="text-sm font-medium text-[#1a63a8]">Thông tin dự án</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Tổng Quan Dự Án</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Khám phá chi tiết về dự án <strong>{project.name}</strong> và những giá trị mà nó mang
            lại.
          </p>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            {/* DESCRIPTION */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">Mô tả dự án</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.description || 'Không có mô tả chi tiết về dự án này.'}
              </p>
            </div>

            {/* PROJECT INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Giá trị dự án */}
              <Card className="border border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#1a63a8]/10">
                      <div className="w-6 h-6 rounded-full bg-[#1a63a8] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">₫</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Giá trị dự án</div>
                  </div>
                  <div className="text-2xl font-bold text-[#1a63a8]">{priceValue}</div>
                </CardContent>
              </Card>

              {/* Danh mục */}
              <Card className="border border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#1a63a8]/10">
                      <div className="w-6 h-6 rounded-full bg-[#1a63a8] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📁</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Danh mục</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mainCategory ? (
                      <Badge className="bg-[#1a63a8] text-white px-3 py-1">
                        {mainCategory.name}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Không xác định</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SERVICES */}
            {project.product_service && project.product_service.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-12"
              >
                <h3 className="text-2xl font-bold mb-6">Dịch vụ bao gồm</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.product_service.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className="p-4 rounded-xl border border-[#1a63a8]/20 bg-gradient-to-r from-[#1a63a8]/5 to-[#1a63a8]/10 hover:from-[#1a63a8]/10 hover:to-[#1a63a8]/20 transition-all duration-300 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1a63a8] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <span className="font-medium text-[#1a63a8]">{service.service.name}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-xl shadow-xl sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-[#1a63a8]/10">
                    <div className="w-6 h-6 rounded-full bg-[#1a63a8] flex items-center justify-center">
                      <span className="text-white text-sm">📋</span>
                    </div>
                  </div>
                  Thông tin dự án
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground font-medium mb-3">Đánh giá</div>
                  <div className="text-2xl font-bold text-[#1a63a8]">{ratingValue}</div>
                </div>

                {project.completion_time && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Thời gian hoàn thành</div>
                    <div className="font-semibold text-green-600">{project.completion_time}</div>
                  </div>
                )}

                <aside className="w-full lg:w-[360px]">
                  <div className="sticky top-20 space-y-4">
                    {project?.demo_url && (
                      <Link
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-slate-500">Xem trực tiếp</div>
                            <div className="text-sm font-medium text-[#1a63a8] group-hover:text-[#0f4175]">
                              Demo
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#1a63a8]" />
                        </div>
                      </Link>
                    )}
                  </div>
                </aside>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Ngày tạo</div>
                  <div className="font-semibold text-muted-foreground">
                    {new Date(project.createdAt || '').toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-[#1a63a8] text-white hover:bg-[#1a63a8]/90 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/lien-he">
                      Liên hệ tư vấn
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#1a63a8]/30 text-[#1a63a8] hover:bg-[#1a63a8]/10 hover:border-[#1a63a8]/50 font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    <Link href="/du-an">← Quay về danh sách</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
