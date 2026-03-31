import { buildMetadataFromPageContent } from '@/lib/seo'
import { resolveAboutPageData } from '@/lib/content/about'
import { getSitePageContent } from '@/lib/services/site-content'
import type { Metadata } from 'next'
import { Hero } from './sections/hero-section'
import { AboutIntroSection } from './sections/about-intro-section'
import { ServicesSection } from './sections/services-section'
import { AboutSection } from './sections/about-section'
import { ValuesSection } from './sections/values-section'

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getSitePageContent('gioi-thieu').catch(() => null)

  return buildMetadataFromPageContent(
    pageContent?.data,
    {
      title: 'Giới thiệu STARTECH',
      description: 'Thông tin về đội ngũ, năng lực triển khai và giá trị khác biệt của STARTECH.',
    },
    { pathname: '/gioi-thieu' },
  )
}

export default async function IntroducePage() {
  const response = await getSitePageContent('gioi-thieu').catch(() => null)
  const content = resolveAboutPageData(response?.data)

  return (
    <div className="w-full overflow-hidden">
      <Hero content={content.hero} />
      <AboutIntroSection content={content.intro} />
      <ServicesSection content={content.services} />
      <AboutSection content={content.highlights} />
      <ValuesSection content={content.values} />
    </div>
  )
}
