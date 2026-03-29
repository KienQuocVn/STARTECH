import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { Footer } from '@/components/footer';
import GlobalFX from '@/components/global-fx';
import { GlobalLoader } from '@/components/global-loader';
import { Navbar } from '@/components/navbar';
import { SchemaScript } from '@/components/schema-script';
import { SocialSidebar } from '@/components/social-sidebar';
import { buildLocalBusinessSchema, getSiteUrl } from '@/lib/seo';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'STARTECH - Doi moi cong nghe, toi da hieu qua',
  description:
    'STARTECH cung cap giai phap cong nghe hien dai: thiet ke website, thuong mai dien tu, phat trien ung dung va tu dong hoa marketing.',
  generator: 'STARTECH',
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    title: 'STARTECH - Doi moi cong nghe, toi da hieu qua',
    description:
      'STARTECH cung cap giai phap cong nghe hien dai: thiet ke website, thuong mai dien tu, phat trien ung dung va tu dong hoa marketing.',
    url: getSiteUrl(),
    siteName: 'STARTECH',
    type: 'website',
    images: [
      {
        url: '/icon/logo.png',
        alt: 'STARTECH',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STARTECH - Doi moi cong nghe, toi da hieu qua',
    description:
      'STARTECH cung cap giai phap cong nghe hien dai: thiet ke website, thuong mai dien tu, phat trien ung dung va tu dong hoa marketing.',
    images: ['/icon/logo.png'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '150x40',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${GeistSans.variable} ${montserrat.variable}`}>
      <body className="bg-white font-sans antialiased">
        <SchemaScript data={buildLocalBusinessSchema()} />
        <Suspense fallback={<GlobalLoader />}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <SocialSidebar />
          <Analytics />
          <GlobalFX />
        </Suspense>
      </body>
    </html>
  );
}
