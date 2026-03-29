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
  titleLine1: 'Thiet ke mang lai cam xuc',
  titleLine2: 'Trai nghiem nguoi dung.',
  description:
    'Chung toi ket hop su sang tao, cam xuc va doi moi de tao ra the gioi ky thuat so ma khan gia cua ban co the ket noi.',
  primaryCtaLabel: 'Lien he ngay',
  primaryCtaHref: '/lien-he',
  sideDescription:
    'Cho du thong qua giao dien truc quan, cong nghe 3D song dong hay cach ke chuyen truc quan tao bao, chung toi thiet ke nhung khoanh khac ma moi nguoi khong chi nhin thay ma con cam nhan duoc.',
  pills: ['UI/UX', '3D VISUALIZATION', 'DEVELOPMENT', '+'],
  scrollLabel: 'Cuon de kham pha',
};

const defaultStats: HomeStatItem[] = [
  {
    icon: '/icon/icon-khach-hang-tin-dung.png',
    label: 'DUOC TIN TUONG BOI',
    value: '100+ khach hang, doanh nghiep',
  },
  {
    icon: '/icon/icon-giao-dien.png',
    label: 'CO SAN',
    value: '400+ giao dien dep, chuan SEO',
  },
  {
    icon: '/icon/icon-linh-vuc.png',
    label: 'DAP UNG',
    value: '50+ linh vuc, nganh nghe',
  },
];

const defaultServices = {
  eyebrow: 'Lam sao de co hang tram don hang moi ngay tu website?',
  title: 'STARTECH giup gia tang doanh so voi SEO va Marketing',
  image: '/img/tang-doanh-so-ban-hang-voi-seo-marketing.png',
  items: [
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Ho tro SEO manh me',
      description:
        'Toi uu cau truc, Core Web Vitals, de dang tuy chinh SEO onpage de dat thu hang cao.',
    },
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Tang hieu qua quang cao',
      description:
        'Trang dich toi uu, tich hop Google Ads va Facebook Ads giup tiep can khach hang hieu qua.',
    },
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Tang 30% ty le hoan tat don',
      description:
        'Abandoned checkout nhac lai gio hang, email marketing va coupon thuc day chuyen doi.',
    },
    {
      icon: '/icon/icon-khach-hang-tin-dung.png',
      title: 'Do luong va phan tich',
      description:
        'Bao cao du lieu khach hang va hanh vi mua sam giup toi uu chien luoc kip thoi.',
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
