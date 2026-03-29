'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const highlights = [
  'Thiết kế giao diện chuẩn nhận diện thương hiệu',
  'Tối ưu trải nghiệm trên mobile, tablet và desktop',
  'Sẵn sàng kết nối SEO, quảng cáo và CRM',
];

const floatingHighlights = [
  {
    label: 'SEO',
    text: highlights[2],
    containerClassName: 'left-[6%] top-[14%] sm:left-[8%] sm:top-[18%] lg:left-[12%] lg:top-[20%]',
    badgeClassName: 'h-10 w-10 bg-white text-xs font-semibold text-[#1a63a8] sm:h-11 sm:w-11',
    panelClassName: 'left-0 top-12 -translate-y-2 group-hover:translate-y-0 group-active:translate-y-0 sm:top-14',
  },
  {
    label: 'UI',
    text: highlights[0],
    containerClassName: 'right-[4%] top-[16%] sm:right-[8%] sm:top-[22%] lg:right-[10%] lg:top-[24%]',
    badgeClassName: 'h-11 w-11 bg-[#c6e3ff] text-xs font-bold text-white sm:h-12 sm:w-12 sm:text-sm',
    panelClassName: 'right-0 top-14 -translate-y-2 group-hover:translate-y-0 group-active:translate-y-0 sm:top-16',
  },
  {
    label: 'Responsive',
    text: highlights[1],
    containerClassName: 'bottom-[10%] left-[6%] sm:bottom-[14%] sm:left-[12%] lg:bottom-[18%] lg:left-[16%]',
    badgeClassName: 'bg-white px-3 py-2 text-[11px] font-semibold text-[#136b7a] sm:px-4 sm:text-xs',
    panelClassName: 'left-0 bottom-12 translate-y-2 group-hover:translate-y-0 group-active:translate-y-0 sm:bottom-14',
  },
];

const stats = [
  { value: '10+', label: 'Năm kinh nghiệm' },
  { value: '95%', label: 'Khách hàng hài lòng' },
  { value: '72h', label: 'Khởi tạo bản demo' },
  { value: '80+', label: 'Dự án đang vận hành' },
];

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#c6e3ff] via-white to-[#c6e3ff] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-8 xl:gap-12 mt-14">
        <div className="w-full max-w-2xl text-center md:max-w-xl md:text-left lg:max-w-2xl" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1a63a8] shadow-sm backdrop-blur sm:text-sm">
            Hỗ trợ tăng trưởng số
          </span>

          <h1 className="mt-5 text-[2rem] font-bold leading-tight text-[#153b4a] sm:text-4xl md:text-[2.6rem] lg:text-[3.25rem] lg:leading-[1.08] xl:text-[3.65rem]">
            Dịch vụ quản trị website và marketing để doanh nghiệp tăng trưởng bền vững
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#36616f] sm:text-base sm:leading-8 md:mx-0">
            StarTech thiết kế, vận hành và tối ưu website theo hướng chuyển đổi. Chúng tôi kết hợp giao diện đẹp, nội
            dung chuẩn SEO và hệ thống vận hành rõ ràng để website thật sự trở thành kênh bán hàng hiệu quả.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start md:justify-start">
  <Link
    href="/lien-he"
    className="inline-flex w-full max-w-[220px] items-center justify-center rounded-full bg-[#49b1ff] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a63a8] sm:w-auto sm:max-w-none sm:px-7 sm:text-base"
  >
    Nhận tư vấn miễn phí
  </Link>
  <Link
    href="/du-an"
    className="inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-full border border-[#c6e3ff]/30 bg-white/75 px-6 py-3 text-sm font-semibold text-[#136b7a] transition-all duration-300 hover:border-[#c6e3ff] hover:bg-white sm:w-auto sm:max-w-none sm:px-7 sm:text-base"
  >
    Xem dự án thực tế
    <ArrowUpRight className="h-4 w-4" />
  </Link>
</div>
        </div>

        <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[640px]" data-reveal>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.92),rgba(255,255,255,0.08)_58%,transparent_70%)] blur-[2px]" />
          <div className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
          <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />

          <div className="relative aspect-[1.08/1]">
            <Image
              src="/img/Tablet 2.webp"
              alt="Thiết bị website StarTech"
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 620px"
              className="object-contain opacity-70"
              priority
            />
            <Image
              src="/img/Tablet 1.webp"
              alt="Mẫu giao diện website"
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 620px"
              className="object-contain"
              priority
            />
          </div>

          {floatingHighlights.map((item) => (
            <div key={item.label} className={`group absolute ${item.containerClassName}`}>
              <div
                className={`flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-105 ${item.badgeClassName}`}
              >
                {item.label}
              </div>

              <div
                className={`pointer-events-none absolute z-10 w-44 rounded-2xl bg-white/95 px-3 py-3 text-left text-[11px] leading-5 text-[#27515f] opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100 group-active:opacity-100 sm:w-48 sm:text-xs ${item.panelClassName}`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:mt-12 sm:gap-5 md:mt-14 md:grid-cols-4" data-stagger>
        {stats.map((item) => (
          <div key={item.label} className="flex justify-center">
            <div className="flex h-[118px] w-[118px] flex-col items-center justify-center rounded-full border-[8px] border-white/80 bg-[radial-gradient(circle_at_50%_35%,_#ffffff,_#e6f3ff_68%)] text-center sm:h-[132px] sm:w-[132px] lg:h-[138px] lg:w-[138px]">
              <div className="text-xl font-bold text-[#c6e3ff] sm:text-[1.7rem] lg:text-[2rem]">{item.value}</div>
              <div className="mt-2 max-w-[84px] text-[10px] font-medium uppercase leading-4 tracking-[0.12em] text-[#49727e] sm:max-w-[88px] sm:text-[11px]">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
