import Image from 'next/image'

export function AboutIntroSection({
  content,
}: {
  content: {
    imageUrl: string
    title: string
    description: string
  }
}) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative mx-auto mb-8 h-[250px] w-full max-w-4xl sm:h-[320px] md:mb-12 md:h-[400px] lg:h-[500px]">
          <Image src={content.imageUrl} alt={content.title} fill priority sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 60vw" className="rounded-lg object-contain object-center shadow-lg md:object-cover" quality={90} />
        </div>

        <div className="mx-auto max-w-4xl space-y-6 px-2 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 sm:text-4xl md:text-5xl">{content.title}</h2>
          <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">{content.description}</p>
        </div>
      </div>
    </section>
  )
}
