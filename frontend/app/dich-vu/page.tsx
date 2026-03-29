import type { Metadata } from 'next';
import { buildMetadataFromPageContent } from '@/lib/seo';
import { getSitePageContent } from '@/lib/services/site-content';
import ServicesPageClient from './services-page-client';

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getSitePageContent('dich-vu').catch(() => null);

  return buildMetadataFromPageContent(pageContent?.data, {
    title: 'Dich vu thiet ke website va giai phap trien khai STARTECH',
    description:
      'Tong hop cac dich vu thiet ke website, tu van trien khai, giao dien doanh nghiep va toi uu chuyen doi cua STARTECH.',
  }, { pathname: '/dich-vu' });
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}
