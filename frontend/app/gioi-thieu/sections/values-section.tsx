import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'

export function ValuesSection({
  content,
}: {
  content: {
    heading: string
    description: string
    values: Array<{ number: string; title: string; description: string }>
    videoTitle: string
    videoDescription: string
    videoImageUrl: string
    trophyTitle: string
    trophyDescription: string
    trophyImageUrl: string
    diversityTitle: string
    diversityBackgroundUrl: string
    diversityItems: string[]
    ctaDescription: string
    ctaLabel: string
    ctaHref: string
  }
}) {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6 lg:sticky lg:top-24">
              <h2 className="text-3xl leading-tight text-gray-800 md:text-4xl lg:text-5xl">{content.heading}</h2>
              <p className="text-base leading-relaxed text-gray-600 md:text-lg">{content.description}</p>
            </div>

            <div className="space-y-8">
              {content.values.map((value) => (
                <div key={`${value.number}-${value.title}`} className="rounded-md border-l-4 border-[#1a63a8] bg-white/70 py-4 pl-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-2 text-5xl font-bold text-[#1a63a8]/20 md:text-6xl">{value.number}</div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800 md:text-2xl">{value.title}</h3>
                  <p className="text-base leading-relaxed text-gray-600 md:text-lg">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div className="group relative h-[250px] w-full overflow-hidden rounded-2xl sm:h-[350px] md:h-[450px] lg:h-[500px]">
            <Image src={content.videoImageUrl} alt={content.videoTitle} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center" quality={90} />
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110 md:h-20 md:w-20">
                <Play className="ml-1 h-8 w-8 text-[#1a63a8] md:h-10 md:w-10" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl leading-tight text-gray-800 md:text-4xl lg:text-5xl">{content.videoTitle}</h2>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">{content.videoDescription}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl leading-tight text-gray-800 md:text-4xl lg:text-5xl">{content.trophyTitle}</h2>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">{content.trophyDescription}</p>
            <Link href="/du-an" className="inline-block rounded-full bg-[#1a63a8] px-8 py-3 text-white transition-colors hover:bg-[#154f84]">
              Xem thêm
            </Link>
          </div>

          <div className="relative h-[300px] w-full sm:h-[400px] lg:h-[500px]">
            <Image src={content.trophyImageUrl} alt={content.trophyTitle} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="rounded-lg object-cover object-center shadow-lg" quality={90} />
          </div>
        </div>
      </section>

      <section className="relative py-32 md:py-40">
        <div className="absolute inset-0">
          <Image src={content.diversityBackgroundUrl} alt={content.diversityTitle} fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[#1a63a8]/90" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <h2 className="mb-8 inline-block border-b-4 border-white pb-2 text-3xl text-white md:mb-12 md:text-4xl lg:text-5xl">{content.diversityTitle}</h2>

          <div className="mb-12 space-y-4">
            {content.diversityItems.map((item) => (
              <div key={item} className="border-b border-white/30 py-3 text-lg text-white transition-colors hover:border-white md:text-xl">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-0 right-0 -bottom-20 z-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
              <p className="mb-6 text-lg leading-relaxed text-gray-700 md:text-xl">{content.ctaDescription}</p>
              <Link href={content.ctaHref} className="inline-block rounded-full bg-[#1a63a8] px-10 py-4 text-white transition-colors hover:bg-[#154f84]">
                {content.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-32 bg-white" />
    </>
  )
}
