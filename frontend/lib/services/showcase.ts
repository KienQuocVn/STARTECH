import { apiClient } from '@/lib/api-client'
import { getAdminAuthHeaders } from '@/lib/services/auth'

export type ShowcaseItem = {
  id: number
  image_url: string
  name: string
  description: string
  website_url?: string | null
  display_order: number
}

type ShowcaseResponse = {
  success: boolean
  data: ShowcaseItem[]
}

export async function getShowcaseItems() {
  return apiClient.get<ShowcaseResponse>('/showcase')
}

export async function createAdminShowcaseItem(payload: Record<string, unknown>) {
  return apiClient.post<{ success: boolean; data: ShowcaseItem }, Record<string, unknown>>('/showcase', payload, {
    headers: getAdminAuthHeaders(),
  })
}

export async function updateAdminShowcaseItem(id: number, payload: Record<string, unknown>) {
  return apiClient.request<{ success: boolean; data: ShowcaseItem }>(`/showcase/${id}`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminShowcaseItem(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/showcase/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}
