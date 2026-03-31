'use client';

import { FAQ } from '@/app/trang-chu/sections/faq';
import { Ecosystem } from '@/app/trang-chu/sections/ecosystem';
import { Hero } from '@/app/trang-chu/sections/hero';
import { Portfolio } from '@/app/trang-chu/sections/portfolio';
import { Services } from '@/app/trang-chu/sections/services';
import { Stats } from '@/app/trang-chu/sections/stats';
import { WebsiteShowcase } from '@/app/trang-chu/sections/website-showcase';
import { ConversionBand } from '@/components/site/conversion-band';
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
      <ConversionBand
        eyebrow="San sang chuyen doi"
        title="Nhan bao gia va lo trinh trien khai ro rang truoc khi bat dau"
        description="STARTECH tap trung vao bai toan kinh doanh cu the: website can hut lead gi, can xay trust ra sao va can van hanh nhu the nao de doi ngu ban hang de tiep tuc su dung."
      />
      <FAQ items={initialFaqs} />
    </div>
  );
}
