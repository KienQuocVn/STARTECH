import type { SitePageContent, SitePageSection } from '@/lib/services/site-content'
import { sanitizePlainText } from '@/lib/sanitize'

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

function sanitizeItems(items: string[] = []) {
  return items.map((item) => sanitizePlainText(item)).filter(Boolean)
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
      title: sanitizePlainText(heroSection?.title || page?.heroTitle || ''),
      description: sanitizePlainText(heroSection?.description || page?.heroDescription || ''),
    } satisfies AboutHeroContent,
    intro: {
      imageUrl: introSection?.imageUrl || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      title: sanitizePlainText(introSection?.title || ''),
      description: sanitizePlainText(introSection?.description || ''),
    } satisfies AboutIntroContent,
    services: {
      eyebrow: sanitizePlainText(servicesSection?.subtitle || ''),
      title: sanitizePlainText(servicesSection?.title || ''),
      imageUrl: servicesSection?.imageUrl || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      buttonLabel: sanitizePlainText(servicesSection?.primaryButtonLabel || 'Xem tat ca dich vu'),
      buttonHref: servicesSection?.primaryButtonHref || '/dich-vu',
      items: sanitizeItems(servicesJson?.items),
    } satisfies AboutServicesContent,
    highlights: {
      title: sanitizePlainText(highlightsSection?.title || ''),
      imageUrl: highlightsSection?.imageUrl || '/img/professional-web-design-team.jpg',
      buttonLabel: sanitizePlainText(highlightsSection?.primaryButtonLabel || 'Tim hieu them'),
      items: sanitizeItems(highlightsJson?.items),
    } satisfies AboutHighlightsContent,
    values: {
      heading: sanitizePlainText(valuesSection?.title || ''),
      description: sanitizePlainText(valuesSection?.description || ''),
      values: (valuesJson?.values ?? []).map((item) => ({
        number: sanitizePlainText(item.number),
        title: sanitizePlainText(item.title),
        description: sanitizePlainText(item.description),
      })),
      videoTitle: sanitizePlainText(valuesSection?.subtitle || ''),
      videoDescription: sanitizePlainText(valuesJson?.videoDescription || ''),
      videoImageUrl: valuesSection?.imageUrl || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      trophyTitle: sanitizePlainText(valuesSection?.primaryButtonLabel || ''),
      trophyDescription: sanitizePlainText(valuesJson?.trophyDescription || ''),
      trophyImageUrl: valuesSection?.secondaryButtonHref || '/img/dich-vu-thiet-ke-website-xay-dung.png',
      diversityTitle: sanitizePlainText(page?.heroBadge || ''),
      diversityBackgroundUrl: '/img/dich-vu-thiet-ke-website-xay-dung.png',
      diversityItems: sanitizeItems(valuesJson?.diversityItems),
      ctaDescription: sanitizePlainText(valuesJson?.ctaDescription || ''),
      ctaLabel: sanitizePlainText(valuesJson?.ctaLabel || 'Lien he ngay'),
      ctaHref: valuesJson?.ctaHref || '/lien-he',
    } satisfies AboutValuesContent,
  }
}
