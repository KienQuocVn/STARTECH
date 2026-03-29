import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/metadata-routes';
import { getProducts } from '@/lib/services/product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsResponse = await getProducts({ page: 1, limit: 500 }).catch(() => ({ data: { items: [] } }));
  return buildSitemapEntries(productsResponse.data?.items ?? []);
}