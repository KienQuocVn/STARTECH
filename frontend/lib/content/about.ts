import type { SitePageContent, SitePageSection } from '@/lib/services/site-content'

type AboutHeroContent = {
  imageUrl: string
  title: string
  description: string
}

type AboutIntroContent = {
  imageUrl: string
  title: string
  description: string
}

type AboutServicesContent = {
  eyebrow: string
  title: string
  imageUrl: string
  buttonLabel: string
  buttonHref: string
  items: string[]
}

type AboutHighlightsContent = {
  title: string
  imageUrl: string
  buttonLabel: string
  items: string[]
}

type AboutValueItem = {
  number: string
  title: string
  description: string
}

type AboutValuesContent = {
  heading: string
  description: string
  values: AboutValueItem[]
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

function findSection(page: SitePageContent | null | undefined, sectionKey: string) {
  return page?.sections.find((section) => section.sectionKey === sectionKey)
}

function readContentJson<T>(section?: SitePageSection | null) {
  if (!section?.contentJson || typeof section.contentJson !== 'object') return null
  return section.contentJson as T
}

export function resolveAboutPageData(page: SitePageContent | null | undefined) {
  const heroSection = findSection(page, 'about-hero')
  const introSection = findSection(page, 'about-intro')
  const servicesSection = findSection(page, 'about-services')
  const highlightsSection = findSection(page, 'about-highlights')
  const valuesSection = findSection(page, 'about-values')

  const servicesJson = readContentJson<{ items?: string[] }>(servicesSection)
  const highlightsJson = readContentJson<{ items?: string[] }>(highlightsSection)
  const valuesJson = readContentJson<{
    values?: AboutValueItem[]
    diversityItems?: string[]
    ctaDescription?: string
    ctaLabel?: string
    ctaHref?: string
    videoDescription?: string
    trophyDescription?: string
  }>(valuesSection)

  return {
    hero: {
      imageUrl: heroSection?.imageUrl || '/img/thiet-ke-web-site-tai-vinh-phuc-2.png',
      title: heroSection?.title || page?.heroTitle || '',
      description: heroSection?.description || page?.heroDescription || '',
    } satisfies AboutHeroContent,
    intro: {
      imageUrl: introSection?.imageUrl || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      title: introSection?.title || '',
      description: introSection?.description || '',
    } satisfies AboutIntroContent,
    services: {
      eyebrow: servicesSection?.subtitle || '',
      title: servicesSection?.title || '',
      imageUrl: servicesSection?.imageUrl || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      buttonLabel: servicesSection?.primaryButtonLabel || 'Xem tất cả dịch vụ',
      buttonHref: servicesSection?.primaryButtonHref || '/dich-vu',
      items: servicesJson?.items ?? [],
    } satisfies AboutServicesContent,
    highlights: {
      title: highlightsSection?.title || '',
      imageUrl: highlightsSection?.imageUrl || '/img/professional-web-design-team.jpg',
      buttonLabel: highlightsSection?.primaryButtonLabel || 'Tìm hiểu thêm',
      items: highlightsJson?.items ?? [],
    } satisfies AboutHighlightsContent,
    values: {
      heading: valuesSection?.title || '',
      description: valuesSection?.description || '',
      values: valuesJson?.values ?? [],
      videoTitle: valuesSection?.subtitle || '',
      videoDescription: valuesJson?.videoDescription || '',
      videoImageUrl: valuesSection?.imageUrl || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      trophyTitle: valuesSection?.primaryButtonLabel || '',
      trophyDescription: valuesJson?.trophyDescription || '',
      trophyImageUrl: valuesSection?.secondaryButtonHref || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      diversityTitle: page?.heroBadge || '',
      diversityBackgroundUrl: '/img/dich-vu-thiet-ke-website-xay-dung.png',
      diversityItems: valuesJson?.diversityItems ?? [],
      ctaDescription: valuesJson?.ctaDescription || '',
      ctaLabel: valuesJson?.ctaLabel || 'Liên hệ ngay',
      ctaHref: valuesJson?.ctaHref || '/lien-he',
    } satisfies AboutValuesContent,
  }
}
