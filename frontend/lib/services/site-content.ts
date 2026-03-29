import { apiClient } from '@/lib/api-client'
import { getAdminAuthHeaders } from '@/lib/services/auth'

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

export async function getAdminSitePages() {
  return apiClient.get<{ success: boolean; data: SitePageContent[] }>('/site-content', {
    headers: getAdminAuthHeaders(),
  })
}

export async function createAdminSitePage(payload: Record<string, unknown>) {
  return apiClient.post<{ success: boolean; data: SitePageContent }, Record<string, unknown>>('/site-content/page', payload, {
    headers: getAdminAuthHeaders(),
  })
}

export async function updateAdminSitePage(id: number, payload: Record<string, unknown>) {
  return apiClient.request<{ success: boolean; data: SitePageContent }>(`/site-content/page/${id}`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminSitePage(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/site-content/page/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}

export async function upsertAdminPageSection(pageId: number, payload: Record<string, unknown>) {
  return apiClient.post<{ success: boolean; data: SitePageSection }, Record<string, unknown>>(
    `/site-content/page/${pageId}/section`,
    payload,
    {
      headers: getAdminAuthHeaders(),
    },
  )
}

export async function deleteAdminPageSection(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/site-content/section/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}

export async function upsertAdminFaq(pageId: number, payload: Record<string, unknown>) {
  return apiClient.post<{ success: boolean; data: SiteFaqItem }, Record<string, unknown>>(`/site-content/page/${pageId}/faq`, payload, {
    headers: getAdminAuthHeaders(),
  })
}

export async function deleteAdminFaq(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/site-content/faq/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}
