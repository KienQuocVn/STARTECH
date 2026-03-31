'use client';

import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AdminToolbarProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  action?: ReactNode;
}

export function AdminToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tim kiem...',
  filters,
  action,
}: AdminToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11"
            />
          </div>
          {filters}
          {action}
        </div>
      </div>
    </div>
  );
}
