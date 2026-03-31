import { apiClient } from '@/lib/api-client'
import { getAdminAuthHeaders } from '@/lib/services/auth'

export type SiteSettingsMap = Record<string, unknown>

export async function getPublicSiteSettings() {
  return apiClient.get<{ success: boolean; data: SiteSettingsMap }>('/site-settings/public')
}

export async function getAdminSiteSettings() {
  return apiClient.get<{ success: boolean; data: SiteSettingsMap }>('/site-settings', {
    headers: getAdminAuthHeaders(),
  })
}

export async function updateAdminSiteSettings(settings: SiteSettingsMap) {
  return apiClient.request<{ success: boolean; data: SiteSettingsMap }>('/site-settings', {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ settings }),
  })
}
