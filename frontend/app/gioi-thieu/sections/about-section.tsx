import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

export function AboutSection({
  content,
}: {
  content: {
    title: string
    imageUrl: string
    buttonLabel: string
    items: string[]
  }
}) {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl font-semibold leading-tight text-gray-800 md:text-4xl lg:text-5xl">{content.title}</h2>

            <div className="space-y-4">
              {content.items.map((item) => (
                <div key={item} className="flex items-start justify-center gap-3 lg:justify-start">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-[#1a63a8]" />
                  <p className="text-base text-gray-700 md:text-lg">{item}</p>
                </div>
              ))}
            </div>

            <a href="/lien-he" className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] px-8 py-3 text-white shadow-md transition-all duration-200">
              {content.buttonLabel}
            </a>
          </div>

          <div className="relative h-64 w-full sm:h-80 md:h-[420px] lg:h-[480px]">
            <Image src={content.imageUrl} alt={content.title} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw" className="rounded-xl object-contain object-center shadow-lg md:object-cover" quality={90} />
          </div>
        </div>
      </div>
    </section>
  )
}
