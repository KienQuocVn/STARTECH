"use client";

import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import type { HomeHeroContent } from '@/lib/content/homepage';

const RobotComponent = dynamic(() => import('@/components/3DModel/RobotComponent'), { ssr: false });

interface HeroProps {
  content: HomeHeroContent;
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[720px]">
      <div className="container absolute bottom-10 left-1/2 z-10 flex w-full -translate-x-1/2 transform flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-end md:gap-12 md:text-left lg:px-16 xl:px-20">
        <div className="mx-auto max-w-3xl md:mx-0 lg:-ml-[120px] xl:-ml-[180px]">
          <h1 className="text-2xl font-semibold leading-[1.05] tracking-tight text-[#101820] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {content.titleLine1}
          </h1>
          <h2 className="text-2xl font-semibold leading-[1.05] tracking-tight text-[#101820] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {content.titleLine2}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs text-[#8a8f8d] sm:mt-4 sm:text-base sm:leading-8 md:mx-0 md:text-lg">
            {content.description}
          </p>

          <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:gap-4 md:justify-start">
            <a
              href={content.primaryCtaHref}
              className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] px-5 text-xs font-medium text-white shadow-lg shadow-black/10 transition-transform hover:scale-[1.03] sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg"
            >
              {content.primaryCtaLabel.toUpperCase()}
            </a>
          </div>
        </div>

        <div className="hidden max-w-md flex-col items-start justify-end gap-4 pb-5 md:flex lg:-mr-[120px] xl:-mr-[180px]">
          <p className="max-w-md text-sm leading-7 text-[#101820]/80 md:text-base md:leading-8 lg:text-lg">
            {content.sideDescription}
          </p>

          <div className="flex flex-wrap gap-3">
            {content.pills.map((text) => (
              <span
                key={text}
                className="rounded-full border border-[#1a63a8]/50 bg-transparent px-3 py-1 text-[11px] font-medium text-[#2F4858] backdrop-blur-sm lg:text-xs"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-4 left-1/2 flex -translate-x-1/2 transform flex-col items-center space-y-1 sm:space-y-2">
        <span className="font-mono text-[11px] text-gray-500 sm:text-sm">{content.scrollLabel}</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-gray-500 sm:h-6 sm:w-6" />
      </div>

      <RobotComponent />
    </section>
  );
}
