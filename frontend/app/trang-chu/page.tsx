import type { Metadata } from 'next';
import { SchemaScript } from '@/components/schema-script';
import { resolveHomePageData } from '@/lib/content/homepage';
import { buildFaqSchema, buildMetadataFromPageContent } from '@/lib/seo';
import { getProductCategories, getProducts } from '@/lib/services/product';
import { getSitePageContent } from '@/lib/services/site-content';
import HomePageClient from './home-page-client';

export async function generateMetadata(): Promise<Metadata> {
  const response = await getSitePageContent('home').catch(() => null);

  return buildMetadataFromPageContent(
    response?.data,
    {
      title: 'STARTECH - Đổi mới công nghệ, tối đa hiệu quả',
      description:
        'STARTECH cung cấp giải pháp công nghệ hiện đại: thiết kế website, thương mại điện tử, phát triển ứng dụng và tự động hóa marketing.',
    },
    { pathname: '/trang-chu' },
  );
}

export default async function HomePage() {
  const [categoriesResponse, productsResponse, homePageContent] = await Promise.all([
    getProductCategories().catch(() => ({ data: [] })),
    getProducts({ page: 1, limit: 100 }).catch(() => ({ data: { items: [] } })),
    getSitePageContent('home').catch(() => null),
  ]);

  const page = homePageContent?.data ?? null;
  const homeData = resolveHomePageData(page);
  const faqs = page?.faqs ?? [];

  return (
    <>
      {faqs.length > 0 ? (
        <SchemaScript data={buildFaqSchema(faqs.map((item) => ({ question: item.question, answer: item.answer })))} />
      ) : null}
      <HomePageClient
        initialPortfolioCategories={categoriesResponse.data ?? []}
        initialPortfolioProducts={productsResponse.data?.items ?? []}
        initialFaqs={faqs}
        hero={homeData.hero}
        stats={homeData.stats}
        services={homeData.services}
      />
    </>
  );
}
