import { apiClient } from '@/lib/api-client'
import { getAdminAuthHeaders } from '@/lib/services/auth'

export type CreateContactRequest = {
  name: string
  company?: string
  email: string
  phone: string
  service?: string
  message?: string
}

export type CreateContactResponse = {
  success: boolean
  message: string
  status?: string
}

export type ContactLead = {
  id: number
  name: string
  email: string
  phone: string
  company?: string | null
  service?: string | null
  message: string
  status: 'WAITING' | 'VIEWED' | 'PROCESSED'
  createdAt: string
  updatedAt: string
}

export async function createContact(payload: CreateContactRequest) {
  return apiClient.post<CreateContactResponse, CreateContactRequest>('/contact', payload)
}

export async function getContactLeads() {
  return apiClient.get<{ success: boolean; data: ContactLead[] }>('/contact', {
    headers: getAdminAuthHeaders(),
  })
}

export async function updateContactLeadStatus(id: number, status: ContactLead['status']) {
  return apiClient.request<{ success: boolean; data: ContactLead }>(`/contact/${id}/status`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ status }),
  })
}

export async function deleteContactLead(id: number) {
  return apiClient.request<{ success: boolean; data: { id: number } }>(`/contact/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  })
}


