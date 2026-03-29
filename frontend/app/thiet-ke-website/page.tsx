import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { SchemaScript } from '@/components/schema-script';
import { FAQSection } from './sections/faq-section';
import { BenefitsSection } from './sections/benefits-section';
import { HeroSection } from './sections/hero-section';
import { PricingSection } from './sections/pricing-section';
import { ProcessSection } from './sections/process-section';
import { ProjectsSection } from './sections/projects-section';
import { TestimonialsSection } from './sections/testimonials-section';
import { buildFaqSchema, buildMetadataFromPageContent } from '@/lib/seo';
import { getSitePageContent } from '@/lib/services/site-content';

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
  const faqs = pageContent?.data?.faqs ?? [];

  return (
    <div className="w-full overflow-hidden bg-background">
      {faqs.length > 0 ? (
        <SchemaScript data={buildFaqSchema(faqs.map((item) => ({ question: item.question, answer: item.answer })))} />
      ) : null}
      <HeroSection />
      <BenefitsSection />
      <ProcessSection />
      <ProjectsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection items={faqs} />
      <Toaster />
    </div>
  );
}
