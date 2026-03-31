import Image from 'next/image'

export function ServicesSection({
  content,
}: {
  content: {
    eyebrow: string
    title: string
    imageUrl: string
    buttonLabel: string
    buttonHref: string
    items: string[]
  }
}) {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider text-[#1a63a8] md:text-base">{content.eyebrow}</h3>
              <h2 className="text-3xl font-semibold leading-tight text-gray-800 sm:text-4xl lg:text-5xl">{content.title}</h2>
            </div>

            <ul className="space-y-3">
              {content.items.map((service) => (
                <li key={service} className="flex items-start justify-center gap-3 text-gray-700 transition-colors hover:text-[#1a63a8] lg:justify-start">
                  <span className="mt-1 flex-shrink-0 text-[#1a63a8]">▸</span>
                  <span className="text-base sm:text-lg">{service}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a href={content.buttonHref} className="inline-block w-full rounded-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] px-8 py-3 text-center font-medium text-white shadow-md transition-all hover:opacity-90 sm:w-auto">
                {content.buttonLabel}
              </a>
            </div>
          </div>

          <div className="relative h-[250px] w-full overflow-hidden rounded-xl shadow-lg sm:h-[320px] md:h-[400px] lg:h-[500px]">
            <Image src={content.imageUrl} alt={content.title} fill priority sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 60vw" className="object-contain object-center md:object-cover" quality={90} />
          </div>
        </div>
      </div>
    </section>
  )
}
