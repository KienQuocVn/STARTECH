import type { ReactNode } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fc_0%,#eef2ff_100%)]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
