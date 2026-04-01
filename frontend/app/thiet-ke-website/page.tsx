import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { SchemaScript } from '@/components/schema-script';
import { resolveWebsiteDesignPageData } from '@/lib/content/marketing-pages';
import { buildFaqSchema, buildMetadataFromPageContent } from '@/lib/seo';
import { getSitePageContent } from '@/lib/services/site-content';
import {
  MarketingCardsSection,
  MarketingCtaSection,
  MarketingFaqSection,
  MarketingHeroSection,
  MarketingProcessSection,
  MarketingStatsSection,
} from '@/components/site/marketing-sections';

export async function generateMetadata(): Promise<Metadata> {
  const response = await getSitePageContent('thiet-ke-website').catch(() => null);

  return buildMetadataFromPageContent(
    response?.data,
    {
      title: 'Dich vu thiet ke website chuyen nghiep',
      description: 'Dich vu thiet ke website chuyen nghiep, chuan SEO va toi uu chuyen doi cho doanh nghiep.',
    },
    { pathname: '/thiet-ke-website' },
  );
}

export default async function WebsitePage() {
  const pageContent = await getSitePageContent('thiet-ke-website').catch(() => null);
  const content = resolveWebsiteDesignPageData(pageContent?.data);
  const faqs = content.faqs;

  return (
    <div className="w-full overflow-hidden bg-background">
      {faqs.length > 0 ? (
        <SchemaScript data={buildFaqSchema(faqs.map((item) => ({ question: item.question, answer: item.answer })))} />
      ) : null}
      <MarketingHeroSection hero={content.hero} />
      <MarketingStatsSection items={content.stats} />
      <MarketingCardsSection intro={content.featureIntro} items={content.features} />
      <MarketingProcessSection intro={content.processIntro} items={content.process} />
      <MarketingCardsSection intro={content.showcaseIntro} items={content.showcase} variant="showcase" />
      <MarketingCtaSection cta={content.cta} />
      <MarketingFaqSection items={faqs} />
      <Toaster />
    </div>
  );
}
