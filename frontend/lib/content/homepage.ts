import type { SitePageContent, SitePageSection } from '@/lib/services/site-content'

export type HomeHeroContent = {
  titleLine1: string
  titleLine2: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  sideDescription: string
  pills: string[]
  scrollLabel: string
}

export type HomeStatItem = {
  icon: string
  label: string
  value: string
}

export type HomeServiceItem = {
  icon: string
  title: string
  description: string
}

const emptyHero: HomeHeroContent = {
  titleLine1: '',
  titleLine2: '',
  description: '',
  primaryCtaLabel: '',
  primaryCtaHref: '/lien-he',
  sideDescription: '',
  pills: [],
  scrollLabel: '',
}

function findSection(page: SitePageContent | null | undefined, keys: string[]) {
  return page?.sections.find((section) => keys.includes(section.sectionKey))
}

function readContentJson<T>(section?: SitePageSection) {
  if (!section?.contentJson || typeof section.contentJson !== 'object') return null
  return section.contentJson as T
}

export function resolveHomePageData(page: SitePageContent | null | undefined) {
  const heroSection = findSection(page, ['home-hero', 'hero'])
  const heroJson = readContentJson<{ sideDescription?: string; pills?: string[]; scrollLabel?: string }>(heroSection)

  const titleLines = (page?.heroTitle || '').split('\n')

  const hero: HomeHeroContent = {
    titleLine1: heroSection?.title || titleLines[0] || emptyHero.titleLine1,
    titleLine2: heroSection?.subtitle || titleLines[1] || emptyHero.titleLine2,
    description: heroSection?.description || page?.heroDescription || emptyHero.description,
    primaryCtaLabel: heroSection?.primaryButtonLabel || emptyHero.primaryCtaLabel,
    primaryCtaHref: heroSection?.primaryButtonHref || emptyHero.primaryCtaHref,
    sideDescription: heroJson?.sideDescription || emptyHero.sideDescription,
    pills: heroJson?.pills || emptyHero.pills,
    scrollLabel: heroJson?.scrollLabel || emptyHero.scrollLabel,
  }

  const statsSection = findSection(page, ['home-stats', 'stats'])
  const statsJson = readContentJson<{ items?: HomeStatItem[] }>(statsSection)

  const servicesSection = findSection(page, ['home-services', 'services'])
  const servicesJson = readContentJson<{ items?: HomeServiceItem[] }>(servicesSection)

  return {
    hero,
    stats: statsJson?.items ?? [],
    services: {
      eyebrow: servicesSection?.subtitle || '',
      title: servicesSection?.title || '',
      image: servicesSection?.description || '',
      items: servicesJson?.items ?? [],
    },
  }
}
