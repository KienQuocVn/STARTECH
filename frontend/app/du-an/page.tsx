import type { Metadata } from 'next';
import { getProductCategories, getProducts } from '@/lib/services/product';
import { buildMetadataFromPageContent } from '@/lib/seo';
import { resolveProjectsPageData } from '@/lib/content/marketing-pages';
import { getSitePageContent } from '@/lib/services/site-content';
import {
  MarketingCardsSection,
  MarketingCtaSection,
  MarketingFaqSection,
  MarketingHeroSection,
  MarketingProcessSection,
  MarketingStatsSection,
} from '@/components/site/marketing-sections';
import ProjectsPageClient from './projects-page-client';

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getSitePageContent('du-an').catch(() => null);

  return buildMetadataFromPageContent(pageContent?.data, {
    title: 'Du an thiet ke website va portfolio STARTECH',
    description:
      'Tong hop cac du an website, giao dien doanh nghiep va landing page STARTECH da thuc hien cho khach hang.',
  }, { pathname: '/du-an' });
}

export default async function ProjectsPage() {
  const [categoriesResponse, productsResponse, pageContent] = await Promise.all([
    getProductCategories().catch(() => ({ data: [] })),
    getProducts({ page: 1, limit: 12 }).catch(() => ({ data: { items: [], total: 0 } })),
    getSitePageContent('du-an').catch(() => null),
  ]);

  const categories = (categoriesResponse.data ?? []) as Array<{ id: number; name: string; product_count: number }>;
  const initialProducts = productsResponse.data?.items ?? [];
  const initialTotalItems = productsResponse.data?.total ?? 0;
  const content = resolveProjectsPageData(pageContent?.data);

  return (
    <div className="w-full overflow-hidden bg-background">
      <MarketingHeroSection hero={content.hero} />
      <MarketingStatsSection items={content.stats} />
      <MarketingCardsSection intro={content.featureIntro} items={content.features} />
      <ProjectsPageClient
        initialProducts={initialProducts}
        initialCategories={categories}
        initialTotalItems={initialTotalItems}
        initialTotalPages={Math.max(1, Math.ceil(initialTotalItems / 12))}
        totalAllItems={initialTotalItems}
      />
      <MarketingProcessSection intro={content.processIntro} items={content.process} />
      {content.showcase.length ? <MarketingCardsSection intro={content.showcaseIntro} items={content.showcase} variant="showcase" /> : null}
      <MarketingCtaSection cta={content.cta} />
      <MarketingFaqSection items={content.faqs} />
    </div>
  );
}
