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
        className="admin-panel fixed left-4 top-4 z-40 rounded-lg p-2 text-[var(--text-body)] hover:bg-[var(--surface-subtle)] md:hidden"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <aside
        className={cn(
          'admin-shell fixed left-0 top-0 z-40 flex h-screen flex-col border-r text-[var(--text-strong)] md:relative md:z-0 md:shadow-none',
          sidebarCollapsed ? 'w-[88px]' : 'w-[280px]',
          !mobileMenuOpen && 'hidden md:flex',
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-[var(--border-admin)] px-5">
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
            className="hidden rounded-full border border-[var(--border-admin)] p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-strong)] lg:block"
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
                    ? 'admin-nav-active'
                    : 'text-[var(--text-body)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-strong)]',
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[var(--border-admin)] p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--brand-primary)] transition-all hover:bg-[var(--surface-accent)]"
          >
            <Globe size={20} />
            {!sidebarCollapsed && 'Xem website'}
          </a>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-body)] transition-all hover:bg-[var(--status-danger-soft)] hover:text-[var(--status-danger)]"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && (isPending ? 'Đang xử lý...' : 'Đăng xuất')}
          </button>
        </div>
      </aside>
    </>
  );
}
