import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/metadata-routes';
import { getAllProducts } from '@/lib/services/product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsResponse = await getAllProducts().catch(() => ({ data: [] }));
  return buildSitemapEntries(productsResponse.data ?? []);
}
