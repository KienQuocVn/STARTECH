import Image from 'next/image'

export function Hero({
  content,
}: {
  content: {
    imageUrl: string
    title: string
    description: string
  }
}) {
  return (
    <section className="relative h-screen w-full">
      <Image src={content.imageUrl} alt={content.title} fill priority sizes="90vw" className="object-cover object-center" quality={90} />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="rounded-lg bg-gradient-to-r from-[rgba(128,216,249,0.7)] to-[rgba(26,99,168,0.7)] p-6 shadow-lg backdrop-blur-sm">
          <h1 className="mb-4 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-6xl lg:text-7xl">{content.title}</h1>
          <p className="max-w-3xl text-base text-white drop-shadow-md sm:text-lg md:text-2xl lg:text-3xl">{content.description}</p>
        </div>
      </div>
    </section>
  )
}
