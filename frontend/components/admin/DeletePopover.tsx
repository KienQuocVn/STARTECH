'use client'

import { useState } from 'react'
import { AlertCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DeletePopoverProps {
  onDelete: () => void | Promise<void>
  itemName?: string
}

export function DeletePopover({ onDelete, itemName }: DeletePopoverProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete()
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full border border-red-200 p-2 text-red-500 transition-colors hover:bg-red-50">
          <Trash2 size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-[28px] border-slate-200 p-0">
        <div className="p-6">
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl text-slate-950">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-600">
              Bạn có chắc muốn xóa <span className="font-semibold text-slate-900">{itemName || 'mục này'}</span> không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
