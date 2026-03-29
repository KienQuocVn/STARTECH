'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { HomeStatItem } from '@/lib/content/homepage';

interface StatsProps {
  items: HomeStatItem[];
}

export function Stats({ items }: StatsProps) {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative block md:hidden">
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent>
              {items.map((item, idx) => (
                <CarouselItem key={`${item.label}-${idx}`} className="basis-[88%] pl-2">
                  <div className="h-full rounded-2xl border bg-gradient-to-b from-white to-[#46DFB1]/5 p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00A1A6]/10 sm:h-11 sm:w-11">
                        <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain sm:h-6 sm:w-6" />
                      </span>
                      <div className="flex-1">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#286478] sm:text-xs">
                          {item.label}
                        </div>
                        <div className="mt-1 min-h-[3.5rem] text-lg font-bold leading-snug text-[#2F4858] sm:min-h-0 sm:text-xl">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 bg-white/90 hover:bg-white" />
            <CarouselNext className="right-0 bg-white/90 hover:bg-white" />
          </Carousel>
        </div>

        <div className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3 lg:gap-6">
          {items.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="rounded-2xl border bg-gradient-to-b from-white to-[#46DFB1]/5 p-5 lg:p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00A1A6]/10 lg:h-11 lg:w-11">
                  <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain lg:h-6 lg:w-6" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#286478] lg:text-sm">{item.label}</div>
                  <div className="mt-1 text-xl font-bold leading-snug text-[#2F4858] lg:text-2xl">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
