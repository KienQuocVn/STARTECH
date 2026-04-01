import type { Metadata } from 'next';
import { buildMetadataFromPageContent } from '@/lib/seo';
import { resolveServicesPageData } from '@/lib/content/marketing-pages';
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
  const pageContent = await getSitePageContent('dich-vu').catch(() => null);

  return buildMetadataFromPageContent(pageContent?.data, {
    title: 'Dich vu thiet ke website va giai phap trien khai STARTECH',
    description:
      'Tong hop cac dich vu thiet ke website, tu van trien khai, giao dien doanh nghiep va toi uu chuyen doi cua STARTECH.',
  }, { pathname: '/dich-vu' });
}

export default async function ServicesPage() {
  const pageContent = await getSitePageContent('dich-vu').catch(() => null)
  const content = resolveServicesPageData(pageContent?.data)

  return (
    <div className="w-full overflow-hidden bg-background">
      <MarketingHeroSection hero={content.hero} />
      <MarketingStatsSection items={content.stats} />
      <MarketingCardsSection intro={content.featureIntro} items={content.features} />
      <MarketingProcessSection intro={content.processIntro} items={content.process} />
      <MarketingCardsSection intro={content.showcaseIntro} items={content.showcase} variant="showcase" />
      <MarketingCtaSection cta={content.cta} />
      <MarketingFaqSection items={content.faqs} />
    </div>
  )
}
