'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  ChevronRight,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { logoutAdmin } from '@/lib/services/auth';
import { useAdminStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Image from 'next/image';
const menuItems = [
  { label: 'Bảng điều khiển', icon: LayoutDashboard, href: '/admin' },
  { label: 'Danh mục đầu tư', icon: Briefcase, href: '/admin/portfolio' },
  { label: 'Nội dung', icon: FileText, href: '/admin/content' },
  { label: 'Khách hàng tiềm năng', icon: MessageSquare, href: '/admin/leads' },
  { label: 'Dịch vụ', icon: Zap, href: '/admin/services' },
  { label: 'Nhận xét', icon: Star, href: '/admin/feedback' },
  { label: 'Trưng bày', icon: Globe, href: '/admin/showcase' },
  { label: 'Cài đặt', icon: Settings, href: '/admin/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAdminStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin().catch(() => null);
      window.location.href = '/login';
    });
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen((current) => !current)}
        className="fixed left-4 top-4 z-40 rounded-lg p-2 hover:bg-gray-100 md:hidden"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white/95 text-slate-900 shadow-xl shadow-slate-200/40 backdrop-blur md:relative md:z-0 md:shadow-none',
          sidebarCollapsed ? 'w-[88px]' : 'w-[280px]',
          !mobileMenuOpen && 'hidden md:flex',
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon/logo.png"
                alt="STARTECH"
                width={160}
                height={50}
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </Link>

          <button
            onClick={toggleSidebar}
            className="hidden rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:block"
          >
            <ChevronRight size={18} className={cn('transition-transform', sidebarCollapsed && 'rotate-180')} />
          </button>
        </div>

        <div className="px-5 pt-5">
          {!sidebarCollapsed ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Menu bảng điều khiển</p> : null}
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  active
                    ? 'bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_100%)] text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-slate-200 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50"
          >
            <Globe size={20} />
            {!sidebarCollapsed && 'Xem website'}
          </a>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && (isPending ? 'Đang xử lý...' : 'Đăng xuất')}
          </button>
        </div>
      </aside>
    </>
  );
}
