'use client'

import { useState } from 'react'
import { Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors">
          <Trash2 size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Xóa {itemName || 'mục'}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa {itemName || 'mục'} này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
