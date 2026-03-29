import { apiClient } from '@/lib/api-client'
import { getAdminAuthHeaders } from '@/lib/services/auth'

export type CatalogService = {
  id: number
  name: string
}

export async function getServicesCatalog() {
  return apiClient.get<{ success: boolean; data: CatalogService[] }>('/services')
}

export async function createAdminService(payload: { name: string }) {
  return apiClient.post<{ success: boolean; data: CatalogService }, { name: string }>('/services', payload, {
    headers: getAdminAuthHeaders(),
  })
}

export async function updateAdminService(id: number, payload: { name: string }) {
  return apiClient.request<{ success: boolean; data: CatalogService }>(`/services/${id}`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminService(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/services/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}
