'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Edit2, GripVertical, Plus } from 'lucide-react'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<ShowcaseForm>(buildForm())
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    const response = await getShowcaseItems()
    setItems(response.data ?? [])
  }

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : 'Khong the tai showcase'))
  }, [])

  const saveItem = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      image_url: form.image_url,
      website_url: form.website_url || null,
      display_order: Number(form.display_order || 0),
    }

    try {
      if (form.id) {
        await updateAdminShowcaseItem(form.id, payload)
        toast.success('Da cap nhat showcase')
      } else {
        await createAdminShowcaseItem(payload)
        toast.success('Da tao showcase')
      }
      await loadData()
      setForm(buildForm())
      setIsFormOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu showcase')
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
      toast.success('Da luu thu tu showcase')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu thu tu showcase')
      await loadData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Showcase</h1>
          <p className="mt-1 text-gray-600">CRUD showcase va luu thu tu hien thi vao backend</p>
        </div>
        <Button
          onClick={() => {
            setForm(buildForm())
            setIsFormOpen(true)
          }}
          className="bg-brand-primary hover:bg-brand-secondary"
        >
          <Plus size={18} className="mr-2" />
          Them showcase
        </Button>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              draggable
              onDragStart={() => setDraggedId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(item.id)}
              className={`flex items-center gap-4 p-4 ${draggedId === item.id ? 'opacity-50' : ''}`}
            >
              <div className="text-gray-400">
                <GripVertical size={20} />
              </div>
              <div className="relative h-20 w-24 overflow-hidden rounded-lg bg-gray-100">
                <Image src={item.image_url || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900">{item.name}</h2>
                <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
                {item.website_url ? <p className="mt-1 text-xs text-brand-primary">{item.website_url}</p> : null}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-primary">{item.display_order}</p>
                <p className="text-xs text-gray-500">Thu tu</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setForm(buildForm(item))
                    setIsFormOpen(true)
                  }}
                  className="rounded p-1 text-brand-primary hover:bg-blue-50"
                >
                  <Edit2 size={16} />
                </button>
                <DeletePopover
                  onDelete={async () => {
                    await deleteAdminShowcaseItem(item.id)
                    await loadData()
                    toast.success('Da xoa showcase')
                  }}
                  itemName={item.name}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Plus size={48} />} title="Chua co showcase" description="Them du an noi bat dau tien." />
      )}

      <SlideOver isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={form.id ? 'Cap nhat showcase' : 'Them showcase'} size="sm">
        <div className="space-y-4">
          {(['name', 'image_url', 'website_url', 'display_order'] as Array<keyof ShowcaseForm>).map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold capitalize text-gray-900">{field}</label>
              <input
                value={String(form[field] ?? '')}
                onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-900">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={saveItem} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu showcase
          </Button>
        </div>
      </SlideOver>
    </div>
  )
}
