"use client"

import { useState, useEffect, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { gsap } from "gsap"
import { ArrowUpRight, Filter, X } from "lucide-react"
import { getProducts, getProductCategories, Product, ProductCategory, getProductsByCategory } from "@/lib/services/product"
import Link from "next/link"
import Image from "next/image"

function PortfolioCard({ title, image, demoUrl }: { title: string; image: string; demoUrl?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const [hovered, setHovered] = useState(false)

  const handleEnter = () => {
    const container = containerRef.current
    const img = imgRef.current
    if (!container || !img) return

    const containerHeight = container.clientHeight
    const imgHeight = img.naturalHeight * (img.clientWidth / img.naturalWidth)
    const distance = Math.max(0, imgHeight - containerHeight)
    if (distance <= 0) return

    const duration = Math.min(18, Math.max(6, distance / 150))
    tweenRef.current?.kill()
    tweenRef.current = gsap.to(img, { y: -distance, duration, ease: "none" })
  }

  const handleLeave = () => {
    const img = imgRef.current
    tweenRef.current?.kill()
    if (img) gsap.to(img, { y: 0, duration: 0.6, ease: "power2.out" })
  }

  return (
    <Card
      className="group relative overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
      data-reveal
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={containerRef}
        className="relative h-[300px] overflow-hidden bg-white sm:h-[360px] lg:h-[400px] xl:h-[420px]"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <Image
          ref={imgRef}
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 20vw"
          className="object-cover will-change-transform transition-transform duration-300"
          priority={false}
          quality={90}
        />

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity duration-300 ${
            hovered ? "opacity-100" : ""
          }`}
        >
          <Link
            href="/lien-he"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-black hover:text-white sm:text-base"
          >
            Liên hệ
          </Link>
          {demoUrl && (
            <button
              onClick={() => window.open(demoUrl, "_blank")}
              className="rounded-full border border-white px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black sm:text-base"
            >
              XEM DEMO
            </button>
          )}
        </div>
      </div>

      <CardContent className="p-4 sm:p-5">
        <div className="flex min-h-[52px] items-center justify-center text-center text-sm font-semibold leading-snug text-black sm:min-h-[56px] sm:text-base">
          <span className="line-clamp-2">{title}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function PortfolioLoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="inline-flex items-center gap-4 rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
        <span className="relative flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1BC1C1]/35"></span>
          <span className="relative inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1BC1C1]/25 border-t-[#1a63a8]"></span>
        </span>
        <span className="text-sm font-medium text-[#2F4858] sm:text-base">Đang tải dự án</span>
      </div>
    </div>
  )
}

interface PortfolioProps {
  initialProducts?: Product[]
  initialCategories?: ProductCategory[]
}

export function Portfolio({
  initialProducts = [],
  initialCategories = [],
}: PortfolioProps) {
  const hasInitialProducts = initialProducts.length > 0
  const hasInitialCategories = initialCategories.length > 0
  const skipInitialFetchRef = useRef(hasInitialProducts)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [loading, setLoading] = useState(!hasInitialProducts)
  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: false })

  useEffect(() => {
    if (hasInitialCategories) return

    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getProductCategories()
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }

    fetchCategories()
  }, [hasInitialCategories])

  useEffect(() => {
    if (skipInitialFetchRef.current && activeCategory === "all") {
      skipInitialFetchRef.current = false
      return
    }

    const fetchFilteredProducts = async () => {
      if (activeCategory === "all") {
        try {
          setLoading(true)
          const response = await getProducts({ page: 1, limit: 100 })
          if (response.success && response.data?.items) {
            setProducts(response.data.items)
          }
        } catch (error) {
          console.error("Error fetching all products:", error)
        } finally {
          setLoading(false)
        }
      } else {
        const matched = activeCategory.match(/^cat-(\d+)$/)
        if (!matched) return

        const catId = parseInt(matched[1], 10)
        try {
          setLoading(true)
          const response = await getProductsByCategory(catId, { page: 1, limit: 100 })
          if (response.success && response.data?.items) {
            setProducts(response.data.items)
          }
        } catch (error) {
          console.error("Error fetching products by category:", error)
          setProducts([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchFilteredProducts()
  }, [activeCategory])

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileFilterOpen])

  const categoriesWithAll = [
    { id: "all", name: "Tất cả" },
    ...categories.map((cat) => ({ id: `cat-${cat.id}`, name: cat.name })),
  ]

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setIsMobileFilterOpen(false)
  }

  return (
    <section className="bg-gradient-to-br from-[#c6e3ff] via-white to-[#c6e3ff] py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between sm:mb-0 sm:block">
        <span className="ms-1 text-sm font-medium uppercase  text-black sm:ms-2 sm:text-base">
          Bạn kinh doanh lĩnh vực nào?
        </span>

        {/* Chỉ hiện ở mobile, ẩn ở sm+ */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-semibold text-black shadow-sm backdrop-blur transition-all duration-300 hover:bg-white sm:hidden"
          aria-label="Mở bộ lọc danh mục"
          aria-expanded={isMobileFilterOpen}
        >
          <Filter className="h-4 w-4" />
          Lọc danh mục
        </button>
      </div>

        <div className="mx-auto">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="max-w-4xl text-2xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                Nghệ thuật của chúng tôi, sự thể hiện của bạn.
              </h2>
            </div>
            <a
              href="/lien-he"
              className="hidden h-11 items-center justify-center rounded-full border border-white bg-transparent px-7 text-sm text-black transition-all duration-300 hover:bg-white hover:text-black sm:h-12 sm:px-8 sm:text-base md:inline-flex"
            >
              XEM TẤT CẢ
              <ArrowUpRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
            </a>
          </div>

          

          <div className="mb-8 hidden flex-wrap items-center gap-3 sm:mb-12 sm:flex sm:gap-4">
            {categoriesWithAll.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:text-sm lg:px-6 lg:text-base ${
                    isActive
                      ? "border-white bg-white text-black"
                      : "border-white bg-transparent text-black hover:bg-white hover:text-black"
                  }`}
                >
                  {cat.name.toUpperCase()}
                </button>
              )
            })}
          </div>

          <div
            className={`fixed inset-0 z-50 bg-black/35 transition-opacity duration-300 sm:hidden ${
              isMobileFilterOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden={!isMobileFilterOpen}
          >
            <div
              className={`ml-auto flex h-full w-[85%] max-w-sm flex-col bg-white px-5 py-5 shadow-2xl transition-transform duration-300 ease-out ${
                isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/60">Bộ lọc</p>
                  <h3 className="mt-1 text-lg font-bold text-black">Chọn danh mục</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition-colors duration-300 hover:bg-black hover:text-white"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
                {categoriesWithAll.map((cat) => {
                  const isActive = activeCategory === cat.id

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-[#f5f9ff] text-black hover:border-black hover:bg-white"
                      }`}
                    >
                      {cat.name.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {loading ? (
            <PortfolioLoadingState />
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-base text-black sm:text-lg">Không có sản phẩm nào trong danh mục này</div>
            </div>
          ) : (
            <Carousel
              className="mx-auto max-w-7xl"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplay]}
            >
              <CarouselContent>
                {products.map((product) => (
                  <CarouselItem key={product.id} className="basis-[88%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                    <PortfolioCard
                      title={product.name}
                      image={product.image_url || "/placeholder.svg"}
                      demoUrl={product.demo_url}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="-left-3 hidden sm:flex md:-left-5 lg:-left-8" />
              <CarouselNext className="-right-3 hidden sm:flex md:-right-5 lg:-right-8" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  )
}
