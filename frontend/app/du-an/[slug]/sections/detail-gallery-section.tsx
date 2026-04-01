'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import type { Product, ProductCategory } from '@/lib/services/product';

interface ProjectDetailProps {
  project: Product;
  categories?: ProductCategory[];
}

export default function ProjectDetailPage({ project, categories = [] }: ProjectDetailProps) {
  const images = useMemo(() => {
    const main = project?.image_url ? [project.image_url] : [];
    const extras = project?.images?.map((i) => i.url).filter(Boolean) ?? [];
    return [...main, ...extras];
  }, [project]);

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (index > images.length - 1) setIndex(Math.max(0, images.length - 1));
  }, [images.length, index]);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const slide = node.querySelectorAll<HTMLElement>('[data-slide]')[index];
    if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [index]);

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, images.length - 1));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <header className="relative">
        <div className="relative z-10 container mx-auto px-6 py-28">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1a63a8] drop-shadow-lg">
              {project?.name}
            </h1>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#1a63a8] text-white hover:opacity-95">
                <a href="/lien-he">
                  Liên hệ tư vấn <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border border-[#1a63a8] text-[#1a63a8] hover:bg-[#1a63a8] hover:text-white bg-transparent hover:opacity-95 border/20"
              >
                <a href="#gallery">Xem gallery</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-6 -mt-10 pb-16">
        <section id="gallery" className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT: carousel */}
            <div className="flex-1">
              <div className="relative">
                <div className="overflow-hidden rounded-xl">
                  <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-slate-50 rounded-2xl">
                    {images.length ? (
                      <button
                        onClick={() => setLightboxOpen(true)}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={images[index]}
                          alt={`slide-${index}`}
                          fill
                          priority
                          quality={90}
                          sizes="100vw"
                          className="object-contain object-center transition-transform duration-500 hover:scale-[1.02]"
                        />
                      </button>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Không có hình ảnh
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white p-2 shadow"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#1a63a8]" />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white p-2 shadow"
                      >
                        <ArrowRight className="w-5 h-5 text-[#1a63a8]" />
                      </button>
                    </>
                  )}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-2 h-2 rounded-full ${
                        i === index ? 'bg-[#1a63a8]' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* thumbnails */}
              <div
                ref={trackRef}
                className="mt-6 flex gap-4 overflow-x-auto snap-x no-scrollbar px-2 py-2"
              >
                {images.map((src, i) => (
                  <div key={src + i} data-slide className="snap-center flex-shrink-0 w-[240px]">
                    <button
                      onClick={() => setIndex(i)}
                      className={`rounded-lg overflow-hidden block ${
                        i === index ? 'ring-2 ring-[#1a63a8]' : ''
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`thumb-${i}`}
                        width={240}
                        height={160}
                        className="w-full h-40 object-cover"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6">
          <div className="relative w-full max-w-[1200px] max-h-[92vh]">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-30 rounded-full bg-white p-2 shadow"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-[78vh] bg-black flex items-center justify-center overflow-auto rounded-md">
              {images?.length > 0 ? (
                <div className="flex justify-center items-center">
                  <Image
                    src={images[index]}
                    alt={`light-${index}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={95}
                    priority
                    className="max-w-none object-contain object-center rounded-md"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  />
                </div>
              ) : (
                <div className="text-white text-center py-10">Không có hình ảnh</div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-white/80">
              <div className="flex items-center gap-2">
                <button onClick={prev} className="rounded-full bg-white p-2 shadow text-[#1a63a8]">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="rounded-full bg-white p-2 shadow text-[#1a63a8]">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm">
                Hình {index + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
