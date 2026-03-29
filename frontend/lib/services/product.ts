import { apiClient } from '@/lib/api-client'

export type Product = {
  id: number
  slug?: string | null
  name: string
  description: string
  price?: number | string | null
  price_Type: 'FIXED' | 'CONTACT'
  rating: number | string
  like?: number
  image_url: string
  demo_url?: string
  completion_time?: string
  createdAt?: string
  updatedAt?: string
  product_category?: Array<{
    category: {
      id: number
      name: string
    }
  }>
  images?: Array<{
    id: number
    url: string
  }>
  product_service?: ProductService[]
}

export type ProductCategory = {
  id: number
  name: string
  product_count?: number
}

export type ProductService = {
  id: number
  service: {
    id: number
    name: string
  }
}

export type PaginatedResponse<T> = {
  success: boolean
  data: {
    items: T[]
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

export type ItemResponse<T> = {
  success: boolean
  data: T
}

const CACHE_TTL_MS = 60_000
const responseCache = new Map<string, { data: unknown; expiresAt: number }>()
const inFlightRequests = new Map<string, Promise<unknown>>()

async function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const cached = responseCache.get(key)
  if (cached && cached.expiresAt > now) {
    return cached.data as T
  }

  const pending = inFlightRequests.get(key)
  if (pending) {
    return pending as Promise<T>
  }

  const request = fetcher()
    .then((result) => {
      responseCache.set(key, {
        data: result,
        expiresAt: Date.now() + CACHE_TTL_MS,
      })
      return result
    })
    .finally(() => {
      inFlightRequests.delete(key)
    })

  inFlightRequests.set(key, request)
  return request
}

// ✅ Lấy danh mục
export async function getProductCategories() {
  return getCached('product-categories', () => apiClient.get<ItemResponse<ProductCategory[]>>('/category'))
}

// ✅ Lấy danh sách sản phẩm
export async function getProducts(params: { page?: number; limit?: number } = {}) {
  const search = new URLSearchParams()
  if (params.page != null) search.set('page', String(params.page))
  if (params.limit != null) search.set('limit', String(params.limit))
  const qs = search.toString()
  const path = `/product${qs ? `?${qs}` : ''}`
  return getCached(`products:${path}`, () => apiClient.get<PaginatedResponse<Product>>(path))
}

// ✅ Lấy sản phẩm theo danh mục
export async function getProductsByCategory(catId: number, params: { page?: number; limit?: number } = {}) {
  const search = new URLSearchParams()
  if (params.page != null) search.set('page', String(params.page))
  if (params.limit != null) search.set('limit', String(params.limit))
  const qs = search.toString()
  const path = `/product/cat/${catId}${qs ? `?${qs}` : ''}`
  return getCached(`products-by-category:${path}`, () => apiClient.get<PaginatedResponse<Product>>(path))
}

// ✅ Lấy chi tiết sản phẩm
export async function getProductById(id: number) {
  return apiClient.get<ItemResponse<Product>>(`/product/${id}`)
}

export async function getProductBySlug(slug: string) {
  return apiClient.get<ItemResponse<Product>>(`/product/slug/${slug}`)
}
