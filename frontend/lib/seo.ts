import type { Metadata } from 'next';
import type { SitePageContent } from '@/lib/services/site-content';

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://startech.vn';
const DEFAULT_OG_IMAGE = '/icon/logo.png';
const SITE_NAME = 'STARTECH';

export function getSiteUrl() {
  return DEFAULT_SITE_URL.replace(/\/$/, '');
}

export function absoluteUrl(pathname = '/') {
  if (pathname.startsWith('http')) return pathname;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

type MetadataOptions = {
  pathname?: string;
  image?: string;
};

export function buildMetadataFromPageContent(
  page: SitePageContent | null | undefined,
  fallback: Metadata = {},
  options: MetadataOptions = {},
): Metadata {
  const title = page?.seoTitle || fallback.title || SITE_NAME;
  const description = page?.seoDescription || fallback.description || '';
  const pathname = options.pathname || '/';
  const canonical = absoluteUrl(pathname);
  const image = absoluteUrl(options.image || DEFAULT_OG_IMAGE);

  return {
    ...fallback,
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: typeof title === 'string' ? title : SITE_NAME,
      description: typeof description === 'string' ? description : '',
      type: 'website',
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          alt: typeof title === 'string' ? title : SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: typeof title === 'string' ? title : SITE_NAME,
      description: typeof description === 'string' ? description : '',
      images: [image],
    },
  };
}

export function buildLocalBusinessSchema() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    email: 'xinchao@startech.com',
    description:
      'STARTECH la website gioi thieu dich vu thiet ke website, portfolio, SEO va giai phap marketing cho freelancer.',
    areaServed: 'VN',
    makesOffer: {
      '@type': 'OfferCatalog',
      name: 'Dich vu thiet ke website',
    },
  };
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
