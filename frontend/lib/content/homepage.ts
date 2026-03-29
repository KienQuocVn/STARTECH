import type { SitePageContent, SitePageSection } from '@/lib/services/site-content';

export type HomeHeroContent = {
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  sideDescription: string;
  pills: string[];
  scrollLabel: string;
};

export type HomeStatItem = {
  icon: string;
  label: string;
  value: string;
};

export type HomeServiceItem = {
  icon: string;
  title: string;
  description: string;
};

const defaultHero: HomeHeroContent = {
  titleLine1: 'Thiết kế mang lại cảm xúc.',
  titleLine2: 'Những trải nghiệm để lại ấn tượng sâu sắc.',
  description:
    'Chung toi ket hop su sang tao, cam xuc va doi moi de tao ra the gioi ky thuat so ma khan gia cua ban co the ket noi.',
  primaryCtaLabel: 'Liên hệ ngay',
  primaryCtaHref: '/lien-he',
  sideDescription:
    'Dù thông qua giao diện trực quan, hiệu ứng 3D sống động hay cách kể chuyện bằng hình ảnh táo bạo, chúng tôi thiết kế những khoảnh khắc mà mọi người không chỉ nhìn thấy mà còn cảm nhận được.',
  pills: ['UI/UX', '3D VISUALIZATION', 'DEVELOPMENT', '+'],
  scrollLabel: 'Cuon de kham pha',
};

const defaultStats: HomeStatItem[] = [
  {
    icon: '/icon/icon-khach-hang-tin-dung.png',
    label: 'Được tin tưởng bởi',
    value: '100+ khach hang, doanh nghiep',
  },
  {
    icon: '/icon/icon-giao-dien.png',
    label: 'Có sẵn',
    value: '400+ giao dien dep, chuan SEO',
  },
  {
    icon: '/icon/icon-linh-vuc.png',
    label: 'Đáp ứng',
    value: '50+ linh vuc, nganh nghe',
  },
];

const defaultServices = {
  eyebrow: 'Làm sao để có hàng trăm đơn hàng mới mỗi ngày từ website?',
  title: 'STARTECH giúp gia tăng doanh số với SEO và Marketing',
  image: '/img/tang-doanh-so-ban-hang-voi-seo-marketing.png',
  items: [
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Hỗ trợ SEO mạnh mẽ',
      description:
        'Tối ưu cấu trúc, Core Web Vitals, dễ dàng tùy chỉnh SEO onpage để đạt thứ hạng cao.',
    },
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Tăng hiệu quả quảng cáo',
      description:
        'Trang đích tối ưu, tích hợp Google Ads và Facebook Ads giúp tiếp cận khách hàng hiệu quả.',
    },
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Tăng 30% tỷ lệ hoàn tất đơn',
      description:
        'Abandoned checkout nhắc lại giỏ hàng, email marketing và coupon thúc đẩy chuyển đổi.',
    },
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Đo lường và phân tích',
      description:
        'Báo cáo dữ liệu khách hàng và hành vi mua sắm giúp tối ưu chiến lược kịp thời.',
    },
  ] as HomeServiceItem[],
};

function findSection(page: SitePageContent | null | undefined, keys: string[]) {
  return page?.sections.find((section) => keys.includes(section.sectionKey));
}

function readContentJson<T>(section?: SitePageSection) {
  if (!section?.contentJson || typeof section.contentJson !== 'object') return null;
  return section.contentJson as T;
}

export function resolveHomePageData(page: SitePageContent | null | undefined) {
  const heroSection = findSection(page, ['home-hero', 'hero']);
  const heroJson = readContentJson<{ sideDescription?: string; pills?: string[]; scrollLabel?: string }>(heroSection);

  const hero: HomeHeroContent = {
    titleLine1: heroSection?.title || page?.heroTitle?.split('\n')[0] || defaultHero.titleLine1,
    titleLine2: heroSection?.subtitle || page?.heroTitle?.split('\n')[1] || defaultHero.titleLine2,
    description: heroSection?.description || page?.heroDescription || defaultHero.description,
    primaryCtaLabel: heroSection?.primaryButtonLabel || defaultHero.primaryCtaLabel,
    primaryCtaHref: heroSection?.primaryButtonHref || defaultHero.primaryCtaHref,
    sideDescription: heroJson?.sideDescription || defaultHero.sideDescription,
    pills: heroJson?.pills?.length ? heroJson.pills : defaultHero.pills,
    scrollLabel: heroJson?.scrollLabel || defaultHero.scrollLabel,
  };

  const statsSection = findSection(page, ['home-stats', 'stats']);
  const statsJson = readContentJson<{ items?: HomeStatItem[] }>(statsSection);
  const stats = statsJson?.items?.length ? statsJson.items : defaultStats;

  const servicesSection = findSection(page, ['home-services', 'services']);
  const servicesJson = readContentJson<{ items?: HomeServiceItem[] }>(servicesSection);

  return {
    hero,
    stats,
    services: {
      eyebrow: servicesSection?.subtitle || defaultServices.eyebrow,
      title: servicesSection?.title || defaultServices.title,
      image: servicesSection?.description || defaultServices.image,
      items: servicesJson?.items?.length ? servicesJson.items : defaultServices.items,
    },
  };
}
