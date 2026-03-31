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

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Portfolio', icon: Briefcase, href: '/admin/portfolio' },
  { label: 'Content', icon: FileText, href: '/admin/content' },
  { label: 'Leads', icon: MessageSquare, href: '/admin/leads' },
  { label: 'Services', icon: Zap, href: '/admin/services' },
  { label: 'Feedback', icon: Star, href: '/admin/feedback' },
  { label: 'Showcase', icon: Globe, href: '/admin/showcase' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
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
          'fixed left-0 top-0 z-40 flex h-screen flex-col bg-brand-sidebar text-black transition-all duration-300 md:relative md:z-0',
          sidebarCollapsed ? 'w-[72px]' : 'w-60',
          !mobileMenuOpen && 'hidden md:flex',
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-brand-sidebar-light p-4">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-brand-accent">STAR</h1>
              <p className="text-xs text-gray-400">TECH ADMIN</p>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="hidden rounded p-1 transition-colors hover:bg-brand-sidebar-light lg:block"
          >
            <ChevronRight size={18} className={cn('transition-transform', sidebarCollapsed && 'rotate-180')} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                  active ? 'bg-brand-primary text-black shadow-lg' : 'text-gray hover:bg-brand-sidebar-light hover:text-black',
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-brand-sidebar-light p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-brand-accent transition-all hover:bg-brand-sidebar-light"
          >
            <Globe size={20} />
            {!sidebarCollapsed && 'Xem website'}
          </a>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && (isPending ? 'Dang xu ly...' : 'Dang xuat')}
          </button>
        </div>
      </aside>
    </>
  );
}
