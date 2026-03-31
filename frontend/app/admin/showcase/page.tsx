'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Edit2, Eye, GripVertical, Plus } from 'lucide-react'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  createAdminShowcaseItem,
  deleteAdminShowcaseItem,
  getShowcaseItems,
  updateAdminShowcaseItem,
  type ShowcaseItem,
} from '@/lib/services/showcase'
import { toast } from 'sonner'

type ShowcaseForm = {
  id?: number
  name: string
  description: string
  image_url: string
  website_url: string
  display_order: string
}

type ModalMode = 'create' | 'view' | 'edit'

const PAGE_SIZE = 10

function getWebsiteDisplay(url?: string | null) {
  const normalized = url?.trim()
  if (!normalized) return null

  try {
    const parsed = new URL(normalized)
    return {
      href: normalized,
      label: parsed.hostname.replace(/^www\./, ''),
    }
  } catch {
    return {
      href: normalized,
      label: normalized,
    }
  }
}

function buildForm(item?: ShowcaseItem | null): ShowcaseForm {
  return {
    id: item?.id,
    name: item?.name ?? '',
    description: item?.description ?? '',
    image_url: item?.image_url ?? '',
    website_url: item?.website_url ?? '',
    display_order: String(item?.display_order ?? 0),
  }
}

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([])
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<ShowcaseForm>(buildForm())
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const loadData = async () => {
    const response = await getShowcaseItems()
    const sorted = [...(response.data ?? [])].sort((a, b) => a.display_order - b.display_order)
    setItems(sorted)
  }

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải showcase'))
  }, [])

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter(
      (item) =>
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.website_url ?? '').toLowerCase().includes(term),
    )
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const saveItem = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      image_url: form.image_url,
      website_url: form.website_url || null,
      display_order: Number(form.display_order || 0),
    }

    try {
      if (modalMode === 'edit' && form.id) {
        await updateAdminShowcaseItem(form.id, payload)
        toast.success('Đã cập nhật showcase')
      } else {
        await createAdminShowcaseItem(payload)
        toast.success('Đã tạo showcase')
      }
      await loadData()
      setForm(buildForm())
      setIsFormOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu showcase')
    }
  }

  const handleDrop = async (targetId: number) => {
    if (draggedId == null || draggedId === targetId) return

    const reordered = [...items]
    const from = reordered.findIndex((item) => item.id === draggedId)
    const to = reordered.findIndex((item) => item.id === targetId)
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)

    const nextItems = reordered.map((item, index) => ({ ...item, display_order: index + 1 }))
    setItems(nextItems)
    setDraggedId(null)

    try {
      await Promise.all(
        nextItems.map((item) =>
          updateAdminShowcaseItem(item.id, {
            display_order: item.display_order,
          }),
        ),
      )
      toast.success('Đã lưu thứ tự showcase')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu thứ tự showcase')
      await loadData()
    }
  }

  const openModal = (mode: ModalMode, item?: ShowcaseItem) => {
    setModalMode(mode)
    setForm(buildForm(item))
    setIsFormOpen(true)
  }

  const isReadOnly = modalMode === 'view'

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Showcase"
        description="Danh sách showcase được đưa về dạng table. Bạn vẫn có thể kéo-thả để sắp xếp thứ tự ngay trong bảng dữ liệu."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, mô tả, website..."
        action={
          <Button onClick={() => openModal('create')} className="h-11 rounded-2xl bg-blue-600 px-5 text-white hover:bg-blue-700">
            <Plus size={18} className="mr-2" />
            Thêm showcase
          </Button>
        }
      />

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="overflow-hidden rounded-[30px] border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Bảng showcase</h2>
            <p className="mt-1 text-sm text-slate-500">Kéo thả icon để đổi thứ tự hiển thị trên trang chủ.</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">{filteredItems.length} kết quả</div>
        </div>

        {paginatedItems.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200 hover:bg-slate-50">
                  <TableHead className="px-5 py-4">Thứ tự</TableHead>
                  <TableHead className="py-4">ình ảnh</TableHead>
                  <TableHead className="py-4">Thông tin</TableHead>
                  <TableHead className="py-4">Website</TableHead>
                  <TableHead className="py-4 text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => {
                  const website = getWebsiteDisplay(item.website_url)

                  return (
                    <TableRow
                      key={item.id}
                    draggable
                    onDragStart={() => setDraggedId(item.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(item.id)}
                    className="border-slate-200"
                    >
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button className="rounded-full border border-slate-200 p-2 text-slate-400 hover:bg-slate-100">
                          <GripVertical size={16} />
                        </button>
                        <div>
                          <p className="text-lg font-semibold text-slate-950">{item.display_order}</p>
                          <p className="text-xs text-slate-500">ID #{item.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="relative h-16 w-24 overflow-hidden rounded-2xl bg-slate-100">
                        <Image src={item.image_url || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[420px] py-4">
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </TableCell>
                    <TableCell className="max-w-[240px] py-4 text-sm text-slate-500">
                      {website ? (
                        <a href={website.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline-offset-4 hover:underline">
                          {website.label}
                        </a>
                      ) : (
                        'Chua gan'
                      )}
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
                        <button
                          onClick={() => openModal('view', item)}
                          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openModal('edit', item)}
                          className="rounded-full border border-blue-200 p-2 text-blue-500 transition hover:bg-blue-50"
                        >
                          <Edit2 size={18} />
                        </button>
                        <DeletePopover
                          onDelete={async () => {
                            await deleteAdminShowcaseItem(item.id)
                            await loadData()
                            toast.success('Đã xóa showcase')
                          }}
                          itemName={item.name}
                        />
                      </div>
                    </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <AdminPagination page={page} totalPages={totalPages} totalItems={filteredItems.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        ) : (
          <div className="p-6">
            <EmptyState icon={<Plus size={48} />} title="Không có showcase phù hợp" description="Thử tìm kiếm lại hoặc tạo showcase mới." />
          </div>
        )}
      </Card>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={modalMode === 'create' ? 'Thêm showcase' : modalMode === 'edit' ? 'Cập nhật showcase' : 'Xem showcase'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900">Tên showcase</label>
            <Input value={form.name} disabled={isReadOnly} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Ảnh đại diện</label>
            <Input value={form.image_url} disabled={isReadOnly} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Website URL</label>
            <Input value={form.website_url} disabled={isReadOnly} onChange={(event) => setForm((prev) => ({ ...prev, website_url: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Thứ tự hiển thị</label>
            <Input value={form.display_order} disabled={isReadOnly} onChange={(event) => setForm((prev) => ({ ...prev, display_order: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Mô tả</label>
            <Textarea value={form.description} disabled={isReadOnly} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} className="mt-2 min-h-28" />
          </div>
          {!isReadOnly ? (
            <Button onClick={saveItem} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Lưu showcase
            </Button>
          ) : null}
        </div>
      </SlideOver>
    </div>
  )
}
