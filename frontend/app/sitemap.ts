import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { getProducts } from '@/lib/services/product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/trang-chu', '/du-an', '/dich-vu', '/thiet-ke-website', '/gioi-thieu', '/lien-he'].map(
    (path) => ({
      url: absoluteUrl(path || '/'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' || path === '/trang-chu' ? 1 : 0.8,
    }),
  );

  const productsResponse = await getProducts({ page: 1, limit: 500 }).catch(() => ({ data: { items: [] } }));
  const projectRoutes = (productsResponse.data?.items ?? [])
    .filter((item) => item.slug)
    .map((item) => ({
      url: absoluteUrl(`/du-an/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}
