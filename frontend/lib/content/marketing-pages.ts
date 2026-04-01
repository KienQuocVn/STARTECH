import type { SiteFaqItem, SitePageContent, SitePageSection } from '@/lib/services/site-content'
import { sanitizePlainText } from '@/lib/sanitize'

export type MarketingHero = {
  badge?: string
  title: string
  description?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  mediaType?: 'image' | '3d'
  mediaUrl?: string
  bullets: string[]
}

export type MarketingItem = {
  title: string
  description?: string
  imageUrl?: string
  icon?: string
  value?: string
  href?: string
}

export type MarketingPageData = {
  hero: MarketingHero
  stats: MarketingItem[]
  featureIntro?: { title: string; subtitle?: string; description?: string }
  features: MarketingItem[]
  processIntro?: { title: string; subtitle?: string; description?: string }
  process: MarketingItem[]
  showcaseIntro?: { title: string; subtitle?: string; description?: string }
  showcase: MarketingItem[]
  cta?: { title: string; description?: string; primaryCtaLabel?: string; primaryCtaHref?: string }
  faqs: SiteFaqItem[]
}

function findSection(page: SitePageContent | null | undefined, ...keys: string[]) {
  return page?.sections.find((section) => keys.includes(section.sectionKey))
}

function readContentJson<T>(section?: SitePageSection | null) {
  if (!section?.contentJson || typeof section.contentJson !== 'object') return null
  return section.contentJson as T
}

function readItems(section?: SitePageSection | null) {
  return readContentJson<{ items?: MarketingItem[] }>(section)?.items ?? []
}

function sanitizeItem(item: MarketingItem): MarketingItem {
  return {
    title: sanitizePlainText(item.title),
    description: sanitizePlainText(item.description),
    imageUrl: item.imageUrl,
    icon: sanitizePlainText(item.icon),
    value: sanitizePlainText(item.value),
    href: item.href,
  }
}

function sanitizeItems(items: MarketingItem[]) {
  return items
    .map(sanitizeItem)
    .filter((item) => item.title || item.description || item.imageUrl || item.value)
}

function sanitizeFaqs(items: SiteFaqItem[]) {
  return items
    .map((faq) => ({
      ...faq,
      question: sanitizePlainText(faq.question),
      answer: faq.answer ?? '',
    }))
    .filter((faq) => faq.question && faq.answer)
}

function makePageData(page: SitePageContent | null | undefined, fallback: Omit<MarketingPageData, 'faqs'>): MarketingPageData {
  const heroSection = findSection(page, 'hero', `${page?.slug}-hero`, 'page-hero')
  const statsSection = findSection(page, 'stats', `${page?.slug}-stats`)
  const featuresSection = findSection(page, 'features', `${page?.slug}-features`, 'benefits', `${page?.slug}-benefits`)
  const processSection = findSection(page, 'process', `${page?.slug}-process`)
  const showcaseSection = findSection(page, 'showcase', `${page?.slug}-showcase`, 'projects', `${page?.slug}-projects`)
  const ctaSection = findSection(page, 'cta', `${page?.slug}-cta`)

  const heroJson = readContentJson<{ bullets?: string[]; mediaType?: 'image' | '3d'; mediaUrl?: string }>(heroSection)
  const stats = sanitizeItems(readItems(statsSection))
  const features = sanitizeItems(readItems(featuresSection))
  const process = sanitizeItems(readItems(processSection))
  const showcase = sanitizeItems(readItems(showcaseSection))

  return {
    hero: {
      badge: sanitizePlainText(page?.heroBadge || heroSection?.subtitle || fallback.hero.badge),
      title: sanitizePlainText(heroSection?.title || page?.heroTitle || fallback.hero.title),
      description: sanitizePlainText(heroSection?.description || page?.heroDescription || fallback.hero.description),
      primaryCtaLabel: sanitizePlainText(heroSection?.primaryButtonLabel || fallback.hero.primaryCtaLabel),
      primaryCtaHref: heroSection?.primaryButtonHref || fallback.hero.primaryCtaHref,
      secondaryCtaLabel: sanitizePlainText(heroSection?.secondaryButtonLabel || fallback.hero.secondaryCtaLabel),
      secondaryCtaHref: heroSection?.secondaryButtonHref || fallback.hero.secondaryCtaHref,
      bullets: (heroJson?.bullets || fallback.hero.bullets).map((item) => sanitizePlainText(item)).filter(Boolean),
      mediaType: heroJson?.mediaType || fallback.hero.mediaType,
      mediaUrl: heroJson?.mediaUrl || heroSection?.imageUrl || fallback.hero.mediaUrl,
    },
    stats: stats.length ? stats : sanitizeItems(fallback.stats),
    featureIntro: featuresSection
      ? {
          title: sanitizePlainText(featuresSection.title || fallback.featureIntro?.title || ''),
          subtitle: sanitizePlainText(featuresSection.subtitle || fallback.featureIntro?.subtitle),
          description: sanitizePlainText(featuresSection.description || fallback.featureIntro?.description),
        }
      : fallback.featureIntro && {
          title: sanitizePlainText(fallback.featureIntro.title),
          subtitle: sanitizePlainText(fallback.featureIntro.subtitle),
          description: sanitizePlainText(fallback.featureIntro.description),
        },
    features: features.length ? features : sanitizeItems(fallback.features),
    processIntro: processSection
      ? {
          title: sanitizePlainText(processSection.title || fallback.processIntro?.title || ''),
          subtitle: sanitizePlainText(processSection.subtitle || fallback.processIntro?.subtitle),
          description: sanitizePlainText(processSection.description || fallback.processIntro?.description),
        }
      : fallback.processIntro && {
          title: sanitizePlainText(fallback.processIntro.title),
          subtitle: sanitizePlainText(fallback.processIntro.subtitle),
          description: sanitizePlainText(fallback.processIntro.description),
        },
    process: process.length ? process : sanitizeItems(fallback.process),
    showcaseIntro: showcaseSection
      ? {
          title: sanitizePlainText(showcaseSection.title || fallback.showcaseIntro?.title || ''),
          subtitle: sanitizePlainText(showcaseSection.subtitle || fallback.showcaseIntro?.subtitle),
          description: sanitizePlainText(showcaseSection.description || fallback.showcaseIntro?.description),
        }
      : fallback.showcaseIntro && {
          title: sanitizePlainText(fallback.showcaseIntro.title),
          subtitle: sanitizePlainText(fallback.showcaseIntro.subtitle),
          description: sanitizePlainText(fallback.showcaseIntro.description),
        },
    showcase: showcase.length ? showcase : sanitizeItems(fallback.showcase),
    cta: ctaSection
      ? {
          title: sanitizePlainText(ctaSection.title || fallback.cta?.title || ''),
          description: sanitizePlainText(ctaSection.description || fallback.cta?.description),
          primaryCtaLabel: sanitizePlainText(ctaSection.primaryButtonLabel || fallback.cta?.primaryCtaLabel),
          primaryCtaHref: ctaSection.primaryButtonHref || fallback.cta?.primaryCtaHref,
        }
      : fallback.cta && {
          title: sanitizePlainText(fallback.cta.title),
          description: sanitizePlainText(fallback.cta.description),
          primaryCtaLabel: sanitizePlainText(fallback.cta.primaryCtaLabel),
          primaryCtaHref: fallback.cta.primaryCtaHref,
        },
    faqs: sanitizeFaqs(page?.faqs ?? []),
  }
}

export function resolveServicesPageData(page: SitePageContent | null | undefined) {
  return makePageData(page, {
    hero: {
      badge: 'Dich vu STARTECH',
      title: 'Goi dich vu website va trien khai tang truong duoc quan ly tu CMS',
      description: 'Toan bo thong diep marketing, CTA, so lieu va media co the dua ve admin de van hanh tap trung.',
      primaryCtaLabel: 'Nhan de xuat trien khai',
      primaryCtaHref: '/lien-he',
      secondaryCtaLabel: 'Xem portfolio',
      secondaryCtaHref: '/du-an',
      bullets: ['Website doanh nghiep', 'Landing page chuyen doi', 'Van hanh SEO va noi dung'],
      mediaType: 'image',
      mediaUrl: '/img/website-design-team.png',
    },
    stats: [
      { title: 'Quy trinh minh bach', value: '4 buoc', description: 'Phan tich, giao dien, trien khai, toi uu' },
      { title: 'Ban giao de van hanh', value: '100%', description: 'Noi dung va CTA co the sua tu admin' },
      { title: 'Toi uu lead', value: 'CMS', description: 'Trang dich vu khong con phu thuoc hardcode' },
    ],
    featureIntro: {
      title: 'Nhom dich vu co the quan ly tap trung',
      subtitle: 'Tu copy den media',
      description: 'Mỗi section tren public site duoc map ve du lieu CMS de admin sua ma khong can deploy lai frontend.',
    },
    features: [
      { title: 'Website doanh nghiep', description: 'Trang gioi thieu nang luc, case study va CTA ro rang.' },
      { title: 'Landing page chien dich', description: 'Noi dung linh hoat theo muc tieu lead va quang cao.' },
      { title: 'SEO content hub', description: 'Cau truc section va thong diep duoc quan ly theo page.' },
      { title: 'Bao tri va mo rong', description: 'Them section, media va FAQ tu admin dashboard.' },
    ],
    processIntro: {
      title: 'Quy trinh trien khai',
      subtitle: 'Lam ro muc tieu kinh doanh',
      description: 'Khung du lieu section cho phep mo ta quy trinh, KPI va handoff ngay tren CMS.',
    },
    process: [
      { title: 'Khao sat nhu cau', description: 'Chot doi tuong, KPI va thong diep can uu tien.' },
      { title: 'Len concept noi dung', description: 'Xac dinh layout section, CTA, social proof va media.' },
      { title: 'Trien khai giao dien', description: 'Dong bo FE/BE/CMS de public site doc dung du lieu.' },
      { title: 'Van hanh va toi uu', description: 'Admin tiep tuc sua, review, publish theo workflow.' },
    ],
    showcaseIntro: {
      title: 'Nhom deliverable chinh',
      subtitle: 'Copy, media, FAQ, CTA',
      description: 'Bat ky section marketing nao cung co the dua vao `contentJson` de giam code hardcode.',
    },
    showcase: [
      { title: 'Section cards', imageUrl: '/modern-corporate-website.png' },
      { title: 'Landing blocks', imageUrl: '/real-estate-website-hero.png' },
      { title: 'Service assets', imageUrl: '/seo-optimization-concept.png' },
    ],
    cta: {
      title: 'Can chot scope va timeline cho page dich vu?',
      description: 'Dat lich trao doi de nhan de xuat noi dung, du lieu CMS va lo trinh trien khai.',
      primaryCtaLabel: 'Dat lich tu van',
      primaryCtaHref: '/lien-he',
    },
  })
}

export function resolveProjectsPageData(page: SitePageContent | null | undefined) {
  return makePageData(page, {
    hero: {
      badge: 'Portfolio STARTECH',
      title: 'Du an, showcase va thong diep trust duoc dieu khien tu CMS',
      description: 'Trang du an can phan hero, CTA va thong ke de admin co the cap nhat ma khong sua component.',
      primaryCtaLabel: 'Xem du an moi',
      primaryCtaHref: '#projects-grid',
      secondaryCtaLabel: 'Lien he tu van',
      secondaryCtaHref: '/lien-he',
      bullets: ['Portfolio thuc te', 'Case study ro rang', 'CTA linh hoat theo chien dich'],
      mediaType: 'image',
      mediaUrl: '/modern-website-mockup-on-laptop-and-mobile.jpg',
    },
    stats: [
      { title: 'Public pages', value: 'CMS-first', description: 'Noi dung hero va CTA doc tu backend' },
      { title: 'Workflow', value: 'Draft/Publish', description: 'Khong sua truc tiep ban live nua' },
      { title: 'Audit', value: 'DB log', description: 'Theo doi thay doi content va action' },
    ],
    featureIntro: {
      title: 'Gia tri cua mot portfolio page dung CMS',
      subtitle: 'Chot trust nhanh hon',
      description: 'So lieu, badge, thong diep chinh va showcase image co the cap nhat theo chien dich.',
    },
    features: [
      { title: 'Hero theo campaign', description: 'Doi title, subtitle, CTA ma khong sua code.' },
      { title: 'Trust metrics', description: 'Them so lieu va ngan gon gia tri noi bat.' },
      { title: 'Showcase blocks', description: 'Su dung section JSON cho anh, text va link.' },
    ],
    processIntro: {
      title: 'Tu draft den public',
      subtitle: 'Page content an toan hon',
      description: 'Admin co the soan, submit review, approve va publish truoc khi noi dung xuat hien tren site.',
    },
    process: [
      { title: 'Soan draft', description: 'Cap nhat page, section, FAQ trong admin.' },
      { title: 'Review', description: 'Gui noi dung sang trang thai in review.' },
      { title: 'Approve', description: 'Chot version duoc phe duyet trong workflow.' },
      { title: 'Publish', description: 'Public site doc snapshot published on dinh.' },
    ],
    showcaseIntro: {
      title: 'Media showcase',
      subtitle: 'Anh du an va visual proof',
      description: 'Khu vuc nay co the doc tu section JSON hoac danh sach product that.',
    },
    showcase: [],
    cta: {
      title: 'Muon dung portfolio de tang trust cho lead?',
      description: 'STARTECH co the giup chuan hoa hero, thong ke va CTA cho trang du an.',
      primaryCtaLabel: 'Nhan de xuat',
      primaryCtaHref: '/lien-he',
    },
  })
}

export function resolveWebsiteDesignPageData(page: SitePageContent | null | undefined) {
  return makePageData(page, {
    hero: {
      badge: 'Thiet ke website',
      title: 'Dich vu thiet ke website chuyen nghiep, chuan SEO va quan ly du lieu tu CMS',
      description: 'Page marketing nay khong con phu thuoc copy hardcode; admin co the sua metadata, FAQ, CTA, showcase va section noi dung.',
      primaryCtaLabel: 'Xem du an tieu bieu',
      primaryCtaHref: '/du-an',
      secondaryCtaLabel: 'Dat lich tu van',
      secondaryCtaHref: '/lien-he',
      bullets: ['Chuan SEO', 'Quan ly CTA tu admin', 'Workflow publish an toan'],
      mediaType: '3d',
    },
    stats: [
      { title: 'Noi dung song song', value: 'CMS + Admin', description: 'Copy va media khong con nam trong component.' },
      { title: 'Review flow', value: '4 trang thai', description: 'Draft, in review, approved, published.' },
      { title: 'Image pipeline', value: 'next/image', description: 'Toi uu tai nguyen anh cho public site.' },
    ],
    featureIntro: {
      title: 'Gia tri tu website duoc van hanh nhu mot CMS-driven page',
      subtitle: 'Noi dung marketing co the thay doi nhanh',
      description: 'Cac block duoi day co the quan ly trong `contentJson` cua section thay vi viet chet trong frontend.',
    },
    features: [
      { title: 'Thay doi thong diep nhanh', description: 'Cap nhat theo tung nhom nganh va chien dich ban hang.' },
      { title: 'Quan ly social proof', description: 'Showcase image, so lieu va trust badge tap trung tu admin.' },
      { title: 'Dong bo metadata + FAQ + CTA', description: 'Khong con moi noi mot kieu giua CMS va giao dien public.' },
      { title: 'De mo rong', description: 'Section moi co the them qua JSON va workflow publish.' },
    ],
    processIntro: {
      title: 'Quy trinh hoan thien page marketing',
      subtitle: 'Tu content den publish',
      description: 'Workflow moi giup team chuan hoa noi dung truoc khi len live site.',
    },
    process: [
      { title: 'Xac dinh section', description: 'Chia hero, loi ich, quy trinh, showcase, FAQ, CTA.' },
      { title: 'Nhap du lieu CMS', description: 'Admin sua title, subtitle, media, cards va links.' },
      { title: 'Review & approve', description: 'Noi dung duoc kiem soat truoc khi public.' },
      { title: 'Publish snapshot', description: 'Frontend doc ban live on dinh tu published version.' },
    ],
    showcaseIntro: {
      title: 'Hinh anh va du an tieu bieu',
      subtitle: 'Media do admin quan ly',
      description: 'Khu vuc nay phu hop cho case study, mockup va sample website.',
    },
    showcase: [
      { title: 'Corporate website', imageUrl: '/modern-corporate-website.png' },
      { title: 'Ecommerce website', imageUrl: '/modern-ecommerce-website.png' },
      { title: 'Portfolio showcase', imageUrl: '/real-estate-website-hero.png' },
    ],
    cta: {
      title: 'Can mot website de chot lead tot hon?',
      description: 'Nhan de xuat cau truc page, CTA va workflow quan tri noi dung cho doanh nghiep cua ban.',
      primaryCtaLabel: 'Nhan bao gia',
      primaryCtaHref: '/lien-he',
    },
  })
}
