import { apiClient } from '@/lib/api-client'

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
