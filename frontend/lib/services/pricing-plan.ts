import { apiClient } from '@/lib/api-client'
import { getAdminAuthHeaders } from '@/lib/services/auth'

export type PricingFeature = {
  id: number
  name: string
  description?: string | null
}

export type PricingPlan = {
  id: number
  name: string
  price: number | null
  price_Type?: 'FIXED' | 'CONTACT'
  description?: string | null
  features: PricingFeature[]
}

export async function getPricingPlans() {
  return apiClient.get<{ success: boolean; data: PricingPlan[] }>('/pricing-plan')
}

export async function createAdminPricingPlan(payload: Record<string, unknown>) {
  return apiClient.post<{ success: boolean; data: PricingPlan }, Record<string, unknown>>('/pricing-plan', payload, {
    headers: getAdminAuthHeaders(),
  })
}

export async function updateAdminPricingPlan(id: number, payload: Record<string, unknown>) {
  return apiClient.request<{ success: boolean; data: PricingPlan }>(`/pricing-plan/${id}`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminPricingPlan(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/pricing-plan/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}
