'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { Footer } from '@/components/footer';
import GlobalFX from '@/components/global-fx';
import { Navbar } from '@/components/navbar';
import { SchemaScript } from '@/components/schema-script';
import { SocialSidebar } from '@/components/social-sidebar';
import { buildLocalBusinessSchema } from '@/lib/seo';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <Analytics />
        {children}
      </>
    );
  }

  return (
    <>
      <SchemaScript data={buildLocalBusinessSchema()} />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <SocialSidebar />
      <Analytics />
      <GlobalFX />
    </>
  );
}
