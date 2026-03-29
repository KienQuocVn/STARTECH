'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BriefcaseBusiness, FileText, FolderKanban, LayoutDashboard, LogOut, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
  { name: 'Tong quan', href: '/admin', icon: LayoutDashboard },
  { name: 'Du an', href: '/admin/projects', icon: FolderKanban },
  { name: 'Noi dung', href: '/admin/content', icon: FileText },
  { name: 'Lead', href: '/admin/leads', icon: BriefcaseBusiness },
  { name: 'Cau hinh', href: '/admin#settings', icon: Settings },
];

type StoredAdminUser = {
  fullName?: string;
  email?: string;
  role?: string;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<StoredAdminUser | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('startech_admin_user');
    if (!rawUser) return;

    try {
      setUser(JSON.parse(rawUser) as StoredAdminUser);
    } catch {
      setUser(null);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('startech_admin_token');
    localStorage.removeItem('startech_admin_refresh_token');
    localStorage.removeItem('startech_admin_user');
    document.cookie = 'startech_admin_token=; path=/; max-age=0; samesite=lax';
    window.location.href = '/login';
  }

  const initials =
    user?.fullName
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fff_24%,#f8fafc_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-300/40">
                ST
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">STARTECH</div>
                <div className="text-sm text-slate-900">Admin Console</div>
              </div>
            </Link>
            <div className="hidden text-sm text-slate-500 md:block">
              <span>Dashboard</span> <span className="mx-1">/</span>
              <span className="capitalize">{pathname.replace('/admin', '').replace('/', '') || 'tong-quan'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tim lead, du an, noi dung..."
                className="w-80 border-slate-200 bg-slate-50 pl-10 focus:bg-white"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 gap-3 rounded-full px-2">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarFallback className="bg-slate-950 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <div className="text-sm font-medium text-slate-900">{user?.fullName || 'STARTECH Admin'}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {user?.role?.replace('_', ' ') || 'SUPER ADMIN'}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>{user?.email || 'admin@startech.local'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">Tong quan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">Dang nhap lai</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-rose-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Dang xuat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[260px_minmax(0,1fr)] md:px-6">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-5 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-300">Van hanh hien tai</div>
            <p className="mt-2 text-sm leading-6 text-slate-100">
              Tap trung quan ly portfolio, site content va lead tu form lien he trong mot dashboard.
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                    isActive
                      ? 'bg-amber-50 font-medium text-amber-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
