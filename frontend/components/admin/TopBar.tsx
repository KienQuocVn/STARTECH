'use client';

import { useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, LogOut, Menu, User } from 'lucide-react';
import { useAdminStore } from '@/lib/store';
import { logoutAdmin } from '@/lib/services/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const breadcrumbs: Record<string, string[]> = {
  '/admin': ['Dashboard'],
  '/admin/portfolio': ['Portfolio'],
  '/admin/content': ['Content'],
  '/admin/leads': ['Leads'],
  '/admin/services': ['Services'],
  '/admin/feedback': ['Feedback'],
  '/admin/showcase': ['Showcase'],
  '/admin/settings': ['Settings'],
};

export function TopBar() {
  const pathname = usePathname();
  const { toggleSidebar } = useAdminStore();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin().catch(() => null);
      window.location.href = '/login';
    });
  }

  const crumbs =
    Object.entries(breadcrumbs).find(([path]) => pathname === path || pathname.startsWith(`${path}/`))?.[1] || ['Admin'];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <button onClick={toggleSidebar} className="hidden rounded-lg p-2 transition-colors hover:bg-gray-100 md:block">
          <Menu size={20} />
        </button>

        <nav className="hidden items-center gap-1 text-sm text-gray-600 sm:flex">
          {crumbs.map((crumb, idx) => (
            <div key={crumb} className="flex items-center gap-1">
              {idx > 0 && <span className="text-gray-400">{'>'}</span>}
              <span className={cn(idx === crumbs.length - 1 && 'font-semibold text-gray-900')}>{crumb}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">Admin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex items-center gap-2">
              <User size={16} />
              <span>Ho so</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Thiet lap tai khoan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={handleLogout} disabled={isPending}>
              <LogOut size={16} />
              <span>{isPending ? 'Dang xu ly...' : 'Dang xuat'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
