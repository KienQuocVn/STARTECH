'use client'

import { useEffect, useState } from 'react'
import { Edit2, Plus, Star } from 'lucide-react'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

function renderStars(rating: number) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [form, setForm] = useState<FeedbackForm>({ name: '', comment: '', rating: '5' })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    const response = await getFeedbacks({ page: 1, limit: 100 })
    setFeedbacks(response.data?.items ?? [])
  }

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : 'Khong the tai feedback'))
  }, [])

  const saveFeedback = async () => {
    const payload = {
      name: form.name,
      comment: form.comment,
      rating: Number(form.rating),
    }

    try {
      if (form.id) {
        await updateAdminFeedback(form.id, payload)
        toast.success('Da cap nhat feedback')
      } else {
        await createFeedback(payload)
        toast.success('Da tao feedback')
      }
      await loadData()
      setForm({ name: '', comment: '', rating: '5' })
      setIsFormOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu feedback')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          <p className="mt-1 text-gray-600">Danh sach feedback tu backend, khong con su dung mock data</p>
        </div>
        <Button
          onClick={() => {
            setForm({ name: '', comment: '', rating: '5' })
            setIsFormOpen(true)
          }}
          className="bg-brand-primary hover:bg-brand-secondary"
        >
          <Plus size={18} className="mr-2" />
          Them feedback
        </Button>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      {feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{feedback.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        id: feedback.id,
                        name: feedback.name,
                        comment: feedback.comment,
                        rating: String(feedback.rating),
                      })
                      setIsFormOpen(true)
                    }}
                    className="rounded p-1 text-brand-primary hover:bg-blue-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <DeletePopover
                    onDelete={async () => {
                      await deleteAdminFeedback(feedback.id)
                      await loadData()
                      toast.success('Da xoa feedback')
                    }}
                    itemName={feedback.name}
                  />
                </div>
              </div>
              <div className="mb-3">{renderStars(Number(feedback.rating))}</div>
              <p className="text-sm text-gray-700">{feedback.comment}</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Star size={48} />} title="Chua co feedback" description="Hay tao feedback dau tien tu admin." />
      )}

      <SlideOver isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={form.id ? 'Cap nhat feedback' : 'Them feedback'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-900">Ten</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900">Danh gia</label>
            <select
              value={form.rating}
              onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} sao
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900">Noi dung</label>
            <textarea
              value={form.comment}
              onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
              className="mt-2 min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={saveFeedback} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu feedback
          </Button>
        </div>
      </SlideOver>
    </div>
  )
}
