'use client'

import { useEffect, useMemo, useState } from 'react'
import { Edit2, Eye, Plus, Star } from 'lucide-react'
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
  createFeedback,
  deleteAdminFeedback,
  getFeedbacks,
  updateAdminFeedback,
  type Feedback,
} from '@/lib/services/feedback'
import { toast } from 'sonner'

type FeedbackForm = {
  id?: number
  name: string
  comment: string
  rating: string
}

type ModalMode = 'create' | 'view' | 'edit'

const PAGE_SIZE = 10

function renderStars(rating: number) {
  return (
    <div className="flex gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={14} fill={star <= rating ? 'currentColor' : 'none'} />
      ))}
    </div>
  )
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [form, setForm] = useState<FeedbackForm>({ name: '', comment: '', rating: '5' })
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [page, setPage] = useState(1)

  const loadData = async () => {
    const response = await getFeedbacks({ page: 1, limit: 100 })
    setFeedbacks(response.data?.items ?? [])
  }

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải nhận xét'))
  }, [])

  const filteredFeedbacks = useMemo(() => {
    const term = search.trim().toLowerCase()

    return feedbacks.filter((feedback) => {
      const matchesSearch =
        !term ||
        feedback.name.toLowerCase().includes(term) ||
        feedback.comment.toLowerCase().includes(term)

      const matchesRating = ratingFilter === 'all' || String(feedback.rating) === ratingFilter
      return matchesSearch && matchesRating
    })
  }, [feedbacks, ratingFilter, search])

  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / PAGE_SIZE))
  const paginatedFeedbacks = filteredFeedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search, ratingFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const saveFeedback = async () => {
    const payload = {
      name: form.name,
      comment: form.comment,
      rating: Number(form.rating),
    }

    try {
      if (modalMode === 'edit' && form.id) {
        await updateAdminFeedback(form.id, payload)
        toast.success('Đã cập nhật nhận xét')
      } else {
        await createFeedback(payload)
        toast.success('Đã tạo nhận xét')
      }
      await loadData()
      setForm({ name: '', comment: '', rating: '5' })
      setIsFormOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu nhận xét')
    }
  }

  const openModal = (mode: ModalMode, feedback?: Feedback) => {
    setModalMode(mode)
    if (feedback) {
      setForm({
        id: feedback.id,
        name: feedback.name,
        comment: feedback.comment,
        rating: String(feedback.rating),
      })
    } else {
      setForm({ name: '', comment: '', rating: '5' })
    }
    setIsFormOpen(true)
  }

  const isReadOnly = modalMode === 'view'

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Feedback"
        description="Quản lý đánh giá khách hàng theo bảng dữ liệu, có tìm kiếm, lọc theo số sao và phân trang để thao tác nhanh hơn."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên hoặc nội dung nhận xét..."
        filters={
          <select
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
            className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
          >
            <option value="all">Tất cả mức sao</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} sao
              </option>
            ))}
          </select>
        }
        action={
          <Button onClick={() => openModal('create')} className="h-11 rounded-2xl bg-blue-600 px-5 text-white hover:bg-blue-700">
            <Plus size={18} className="mr-2" />
            Thêm nhận xét
          </Button>
        }
      />

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="overflow-hidden rounded-[30px] border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Bảng nhận xét</h2>
            <p className="mt-1 text-sm text-slate-500">Tổng {feedbacks.length} nhận xét từ dữ liệu backend.</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">{filteredFeedbacks.length} kết quả</div>
        </div>

        {paginatedFeedbacks.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200 hover:bg-slate-50">
                  <TableHead className="px-5 py-4">Khách hàng</TableHead>
                  <TableHead className="py-4">Nội dung</TableHead>
                  <TableHead className="py-4">Đánh giá</TableHead>
                  <TableHead className="py-4">Ngày tạo</TableHead>
                  <TableHead className="py-4 text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id} className="border-slate-200">
                    <TableCell className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-950">{feedback.name}</p>
                        <p className="mt-1 text-xs text-slate-500">ID #{feedback.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[420px] py-4 text-sm leading-6 text-slate-600">
                      <div className="line-clamp-2">{feedback.comment}</div>
                    </TableCell>
                    <TableCell className="py-4">{renderStars(Number(feedback.rating))}</TableCell>
                    <TableCell className="py-4 text-sm text-slate-500">
                      {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
                        <button
                          onClick={() => openModal('view', feedback)}
                          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openModal('edit', feedback)}
                          className="rounded-full border border-blue-200 p-2 text-blue-500 transition hover:bg-blue-50"
                        >
                          <Edit2 size={18} />
                        </button>
                        <DeletePopover
                          onDelete={async () => {
                            await deleteAdminFeedback(feedback.id)
                            await loadData()
                            toast.success('Đã xóa nhận xét')
                          }}
                          itemName={feedback.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination page={page} totalPages={totalPages} totalItems={filteredFeedbacks.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        ) : (
          <div className="p-6">
            <EmptyState icon={<Star size={48} />} title="Khong co nhận xét phù hợp" description="Thu doi bo loc hoac tao nhận xét moi." />
          </div>
        )}
      </Card>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={modalMode === 'create' ? 'Them nhận xét' : modalMode === 'edit' ? 'Cập nhật nhận xét' : 'Xem nhận xét'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-900">Tên</label>
            <Input
              value={form.name}
              disabled={isReadOnly}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Đánh giá</label>
            <select
              value={form.rating}
              disabled={isReadOnly}
              onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} sao
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900">Nội dung</label>
            <Textarea
              value={form.comment}
              disabled={isReadOnly}
              onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
              className="mt-2 min-h-32"
            />
          </div>
          {!isReadOnly ? (
            <Button onClick={saveFeedback} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Lưu nhận xét
            </Button>
          ) : null}
        </div>
      </SlideOver>
    </div>
  )
}
