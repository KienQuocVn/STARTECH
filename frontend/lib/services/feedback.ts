import { apiClient } from '@/lib/api-client'

export type Feedback = {
  id: number
  name: string
  comment: string
  rating: number
  createdAt: string
}

export type CreateFeedbackRequest = {
  name: string
  comment: string
  rating: number
}

export type PaginatedResponse<T> = {
  success: boolean
  statusCode?: number
  message?: string
  data: {
    items: T[]
    page?: number
    limit?: number
    total?: number
  }
}

export type ItemResponse<T> = {
  success: boolean
  statusCode?: number
  message?: string
  data: T
}

// Lấy danh sách feedback với phân trang
export async function getFeedbacks(params: { page?: number; limit?: number } = {}) {
  const search = new URLSearchParams()
  if (params.page != null) search.set('page', String(params.page))
  if (params.limit != null) search.set('limit', String(params.limit))
  const qs = search.toString()
  const path = `/feedback${qs ? `?${qs}` : ''}`
  return apiClient.get<PaginatedResponse<Feedback>>(path)
}

// Tạo feedback mới
export async function createFeedback(feedback: CreateFeedbackRequest) {
  return apiClient.post<ItemResponse<Feedback>>('/feedback', feedback)
}
