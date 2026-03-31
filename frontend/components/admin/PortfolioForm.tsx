'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Product, type ProductCategory } from '@/lib/services/product'
import { type CatalogService } from '@/lib/services/service-catalog'

export type PortfolioFormValue = {
  name: string
  slug: string
  description: string
  image_url: string
  demo_url: string
  price_Type: 'FIXED' | 'CONTACT'
  price: string
  completion_time: string
  categoryIds: number[]
  serviceIds: number[]
}

interface PortfolioFormProps {
  project?: Product | null
  categories: ProductCategory[]
  services: CatalogService[]
  onSave: (data: PortfolioFormValue) => void | Promise<void>
  isSubmitting?: boolean
  readOnly?: boolean
}

function buildInitialState(project?: Product | null): PortfolioFormValue {
  return {
    name: project?.name ?? '',
    slug: project?.slug ?? '',
    description: project?.description ?? '',
    image_url: project?.image_url ?? '',
    demo_url: project?.demo_url ?? '',
    price_Type: project?.price_Type ?? 'CONTACT',
    price: project?.price != null ? String(project.price) : '',
    completion_time: project?.completion_time ?? '',
    categoryIds: project?.product_category?.map((item) => item.category.id) ?? [],
    serviceIds: project?.product_service?.map((item) => item.service.id) ?? [],
  }
}

export default function PortfolioForm({
  project,
  categories,
  services,
  onSave,
  isSubmitting = false,
  readOnly = false,
}: PortfolioFormProps) {
  const [formData, setFormData] = useState<PortfolioFormValue>(buildInitialState(project))

  useEffect(() => {
    setFormData(buildInitialState(project))
  }, [project])

  const toggleValue = (key: 'categoryIds' | 'serviceIds', value: number) => {
    if (readOnly) return

    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const handleChange = (key: keyof PortfolioFormValue, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!readOnly) onSave(formData)
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Label htmlFor="name">Tên dự án</Label>
          <Input
            id="name"
            value={formData.name}
            disabled={readOnly}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                name: event.target.value,
                slug: project ? prev.slug : event.target.value.toLowerCase().trim().replace(/\s+/g, '-'),
              }))
            }
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={formData.slug} disabled={readOnly} onChange={(event) => handleChange('slug', event.target.value)} className="mt-2" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <textarea
          id="description"
          value={formData.description}
          disabled={readOnly}
          onChange={(event) => handleChange('description', event.target.value)}
          className="mt-2 min-h-32 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="image_url">Ảnh đại diện</Label>
          <Input id="image_url" value={formData.image_url} disabled={readOnly} onChange={(event) => handleChange('image_url', event.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="demo_url">Link demo</Label>
          <Input id="demo_url" value={formData.demo_url} disabled={readOnly} onChange={(event) => handleChange('demo_url', event.target.value)} className="mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="price_Type">Loại giá</Label>
          <select
            id="price_Type"
            value={formData.price_Type}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, price_Type: event.target.value as 'FIXED' | 'CONTACT' }))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="CONTACT">Liên hệ</option>
            <option value="FIXED">Có giá</option>
          </select>
        </div>
        <div>
          <Label htmlFor="price">Giá</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            disabled={readOnly || formData.price_Type === 'CONTACT'}
            onChange={(event) => handleChange('price', event.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="completion_time">Thời gian hoàn thành</Label>
          <Input
            id="completion_time"
            value={formData.completion_time}
            disabled={readOnly}
            onChange={(event) => handleChange('completion_time', event.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Label>Danh mục</Label>
          <Card className="mt-2 space-y-2 p-4">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={formData.categoryIds.includes(category.id)}
                  disabled={readOnly}
                  onCheckedChange={() => toggleValue('categoryIds', category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </Card>
        </div>

        <div>
          <Label>ịch vụ liên quan</Label>
          <Card className="mt-2 space-y-2 p-4">
            {services.map((service) => (
              <label key={service.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={formData.serviceIds.includes(service.id)}
                  disabled={readOnly}
                  onCheckedChange={() => toggleValue('serviceIds', service.id)}
                />
                <span>{service.name}</span>
              </label>
            ))}
          </Card>
        </div>
      </div>

      {!readOnly ? (
        <Button type="submit" disabled={isSubmitting} className="w-full ">
          {isSubmitting ? 'Đang lưu...' : 'Lưu dự án'}
        </Button>
      ) : null}
    </form>
  )
}
