'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminPaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function AdminPagination({ page, totalPages, totalItems, pageSize, onPageChange }: AdminPaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1)
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Hien thi <span className="font-semibold text-slate-900">{start}</span> - <span className="font-semibold text-slate-900">{end}</span> tren tong <span className="font-semibold text-slate-900">{totalItems}</span> ban ghi
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft size={16} className="mr-1" />
          Truoc
        </Button>
        <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          {page} / {safeTotalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
        >
          Sau
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
