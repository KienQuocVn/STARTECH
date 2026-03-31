import type { MetadataRoute } from 'next'
import { absoluteUrl, getSiteUrl } from './seo.ts'

export type SitemapProject = {
  slug?: string | null
  updatedAt?: string
}

export function buildSitemapEntries(projects: SitemapProject[] = []): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/trang-chu', '/du-an', '/dich-vu', '/thiet-ke-website', '/lien-he'].map(
    (path) => ({
      url: absoluteUrl(path || '/'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' || path === '/trang-chu' ? 1 : 0.8,
    }),
  )

  const projectRoutes = projects
    .filter((item) => item.slug)
    .map((item) => ({
      url: absoluteUrl(`/du-an/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...projectRoutes]
}

export function buildRobotsConfig(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  }
}
