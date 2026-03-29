import { apiClient } from '@/lib/api-client'

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

export async function createContact(payload: CreateContactRequest) {
  return apiClient.post<CreateContactResponse, CreateContactRequest>('/contact', payload)
}


