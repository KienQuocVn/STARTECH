'use client';

import { useTransition } from 'react';
import { LogOut, Menu, Search, User } from 'lucide-react';
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

export function TopBar() {
  const { toggleSidebar } = useAdminStore();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin().catch(() => null);
      window.location.href = '/login';
    });
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <button onClick={toggleSidebar} className="hidden rounded-full border border-slate-200 p-2 transition-colors hover:bg-slate-100 md:block">
          <Menu size={20} />
        </button>

        <div className="hidden h-12 w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            readOnly
            value="Tìm kiếm nhanh trong admin..."
            className="w-full bg-transparent text-sm text-slate-500 outline-none"
          />
        </div>

        
      </div>

      <div className="flex items-center gap-3">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 transition-colors hover:bg-slate-50">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">STARTECH team</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex items-center gap-2">
              <User size={16} />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Thiết lập tài khoản</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={handleLogout} disabled={isPending}>
              <LogOut size={16} />
              <span>{isPending ? 'Đang xử lý...' : 'Đăng xuất'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
