"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import Image from "next/image";
import { getShowcaseItems, type ShowcaseItem } from "@/lib/services/showcase";

export function WebsiteShowcase() {
  const [websites, setWebsites] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDesktopGrid, setIsDesktopGrid] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchShowcaseItems = async () => {
      try {
        const response = await getShowcaseItems();
        if (mounted && response.success && response.data) {
          setWebsites(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch showcase items", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchShowcaseItems();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncGridMode = (event?: MediaQueryListEvent) => {
      setIsDesktopGrid(event ? event.matches : mediaQuery.matches);
    };

    syncGridMode();
    mediaQuery.addEventListener("change", syncGridMode);

    return () => {
      mediaQuery.removeEventListener("change", syncGridMode);
    };
  }, []);

  return (
    <section className="website bg-white sm:py-16 lg:py-20">
      <div className="container mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-12">
        <div className="website__left text-center items-center flex flex-col lg:w-[32%] lg:text-left lg:items-start">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#1a63a8] sm:text-base">
            Giải pháp
          </div>
          <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#2F4858] sm:text-4xl lg:text-5xl">
            Thiết kế website và dịch vụ Marketing
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#286478] sm:text-base sm:leading-8">
            Không chỉ thiết kế web chuẩn giao diện và trải nghiệm người dùng, StarTech với hệ sinh thái các giải
            pháp Marketing toàn diện sẽ là điểm tựa vững chắc giúp doanh nghiệp của bạn phát triển lâu dài và bền
            vững.
          </p>
          <a
            href="/dich-vu"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[#1a63a8] px-5 text-sm font-semibold text-[#1a63a8] shadow-sm transition hover:bg-[#1a63a8] hover:text-white sm:h-12 sm:px-6 sm:text-base"
          >
            Tìm hiểu ngay
          </a>
        </div>

        <div className="website__right w-full lg:w-[68%]">
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-sm text-slate-500 sm:min-h-[320px] sm:text-base">
              Đang tải dữ liệu showcase...
            </div>
          ) : (
            <Swiper
              key={isDesktopGrid ? "showcase-desktop" : "showcase-mobile"}
              slidesPerView={2.2}
              spaceBetween={14}
              grabCursor
              loop={websites.length > 4}
              modules={[Grid]}
              grid={{
                rows: isDesktopGrid ? 2 : 1,
                fill: "row",
              }}
              className="website__swiper"
              breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 12, grid: { rows: 1, fill: "row" } },
                480: { slidesPerView: 1.35, spaceBetween: 14, grid: { rows: 1, fill: "row" } },
                640: { slidesPerView: 1.8, spaceBetween: 16, grid: { rows: 1, fill: "row" } },
                768: { slidesPerView: 2, spaceBetween: 18, grid: { rows: 1, fill: "row" } },
                1024: { slidesPerView: 2.2, spaceBetween: 20, grid: { rows: 2, fill: "row" } },
                1280: { slidesPerView: 2.5, spaceBetween: 22, grid: { rows: 2, fill: "row" } },
              }}
            >
              {websites.map((site) => (
                <SwiperSlide key={site.id} className="pb-4">
                  <a
                    href={site.website_url || "/du-an"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative h-52 sm:h-60 lg:h-56 xl:h-60">
                      <Image
                        src={site.image_url}
                        alt={site.name}
                        fill
                        sizes="(max-width: 640px) 88vw, (max-width: 1024px) 46vw, 28vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white md:translate-y-4 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <h3 className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">{site.name}</h3>
                        <p className="line-clamp-3 text-xs leading-5 text-white/90 sm:text-sm sm:leading-6">
                          {site.description}
                        </p>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
