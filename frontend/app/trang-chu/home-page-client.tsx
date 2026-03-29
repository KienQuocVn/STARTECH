'use client';

import { FAQ } from '@/app/trang-chu/sections/faq';
import { Ecosystem } from '@/app/trang-chu/sections/ecosystem';
import { Hero } from '@/app/trang-chu/sections/hero';
import { Portfolio } from '@/app/trang-chu/sections/portfolio';
import { Services } from '@/app/trang-chu/sections/services';
import { Stats } from '@/app/trang-chu/sections/stats';
import { WebsiteShowcase } from '@/app/trang-chu/sections/website-showcase';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
import type { HomeHeroContent, HomeServiceItem, HomeStatItem } from '@/lib/content/homepage';
import type { Product, ProductCategory } from '@/lib/services/product';
import type { SiteFaqItem } from '@/lib/services/site-content';

interface HomePageClientProps {
  initialPortfolioProducts?: Product[];
  initialPortfolioCategories?: ProductCategory[];
  initialFaqs?: SiteFaqItem[];
  hero: HomeHeroContent;
  stats: HomeStatItem[];
  services: {
    eyebrow: string;
    title: string;
    image: string;
    items: HomeServiceItem[];
  };
}

export default function HomePageClient({
  initialPortfolioProducts = [],
  initialPortfolioCategories = [],
  initialFaqs = [],
  hero,
  stats,
  services,
}: HomePageClientProps) {
  useGsapReveal();

  return (
    <div className="flex flex-col">
      <Hero content={hero} />
      <Stats items={stats} />
      <WebsiteShowcase />
      <Services eyebrow={services.eyebrow} title={services.title} image={services.image} items={services.items} />
      <Ecosystem />
      <Portfolio
        initialProducts={initialPortfolioProducts}
        initialCategories={initialPortfolioCategories}
      />
      <FAQ items={initialFaqs} />
    </div>
  );
}
