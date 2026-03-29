import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const templates = [
  { image: "/modern-ecommerce-website.png" },
  { image: "/education-website-design.png" },
  { image: "/spa-beauty-website.jpg" },
  { image: "/modern-corporate-website.png" },
  { image: "/electronics-ecommerce.png" },
]

export function Ecosystem() {
  return (
    <section className="bg-muted/30 py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="mx-auto mb-8 max-w-4xl text-center text-3xl font-bold leading-tight text-[#2F4858] sm:mb-10 sm:text-4xl lg:text-5xl">
          Khám phá các mẫu website đẹp do STARTECH cung cấp
        </h2>

        <div className="relative" data-reveal>
          <Carousel className="mx-auto max-w-6xl" opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {templates.map((tpl, i) => (
                <CarouselItem key={i} className="basis-[86%] sm:basis-1/2 lg:basis-1/3">
                  <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg">
                    <img src={tpl.image} className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex flex-col gap-3">
                        <Button asChild size="sm" className="bg-white text-[#1a63a8] hover:bg-white/90">
                          <Link href="/du-an">Xem thử giao diện</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="border-white text-black hover:bg-white/10">
                          <Link href="/du-an">Chi tiết</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 hidden sm:flex md:-left-5 lg:-left-8" />
            <CarouselNext className="-right-3 hidden sm:flex md:-right-5 lg:-right-8" />
          </Carousel>
        </div>

        <div className="mt-8 text-center">
          <Link href="/du-an" className="inline-flex items-center gap-2 text-sm font-medium text-[#1a63a8] hover:text-[#00A1A6] sm:text-base">
            Xem thêm 400+ giao diện
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
