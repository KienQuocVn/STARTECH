import { apiClient } from '@/lib/api-client'

export type SiteFaqItem = {
  id: number
  question: string
  answer: string
  displayOrder: number
}

export type SitePageSection = {
  id: number
  sectionKey: string
  title?: string | null
  subtitle?: string | null
  description?: string | null
  imageUrl?: string | null
  primaryButtonLabel?: string | null
  primaryButtonHref?: string | null
  secondaryButtonLabel?: string | null
  secondaryButtonHref?: string | null
  contentJson?: unknown
  displayOrder: number
}

export type SitePageContent = {
  id: number
  slug: string
  title: string
  seoTitle?: string | null
  seoDescription?: string | null
  heroBadge?: string | null
  heroTitle?: string | null
  heroDescription?: string | null
  sections: SitePageSection[]
  faqs: SiteFaqItem[]
}

export type SitePageResponse = {
  success: boolean
  data: SitePageContent | null
  message?: string
}

export async function getSitePageContent(slug: string) {
  return apiClient.get<SitePageResponse>(`/site-content/page/${slug}`)
}
