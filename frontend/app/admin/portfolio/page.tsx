'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Edit2, ExternalLink, Plus } from 'lucide-react'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import PortfolioForm, { type PortfolioFormValue } from '@/components/admin/PortfolioForm'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAllProducts,
  getProductCategories,
  updateAdminProduct,
  type Product,
  type ProductCategory,
} from '@/lib/services/product'
import { getServicesCatalog, type CatalogService } from '@/lib/services/service-catalog'
import { getShowcaseItems } from '@/lib/services/showcase'
import { toast } from 'sonner'

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [services, setServices] = useState<CatalogService[]>([])
  const [showcaseNames, setShowcaseNames] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    const [productsResponse, categoriesResponse, servicesResponse, showcaseResponse] = await Promise.all([
      getAllProducts(),
      getProductCategories(),
      getServicesCatalog(),
      getShowcaseItems().catch(() => ({ data: [] })),
    ])

    setProjects(productsResponse.data ?? [])
    setCategories(categoriesResponse.data ?? [])
    setServices(servicesResponse.data ?? [])
    setShowcaseNames((showcaseResponse.data ?? []).map((item) => item.name))
  }

  useEffect(() => {
    let active = true

    loadData()
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Khong the tai portfolio admin')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const showcaseProjects = useMemo(
    () => projects.filter((project) => showcaseNames.includes(project.name)),
    [projects, showcaseNames],
  )

  const handleSaveProject = async (data: PortfolioFormValue) => {
    setIsSubmitting(true)

    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.image_url,
      demo_url: data.demo_url || null,
      price_Type: data.price_Type,
      price: data.price_Type === 'FIXED' && data.price ? Number(data.price) : null,
      completion_time: data.completion_time || null,
      categoryIds: data.categoryIds,
      serviceIds: data.serviceIds,
    }

    try {
      if (editingProject) {
        await updateAdminProduct(editingProject.id, payload)
        toast.success('Da cap nhat du an')
      } else {
        await createAdminProduct(payload)
        toast.success('Da tao du an moi')
      }

      await loadData()
      setIsFormOpen(false)
      setEditingProject(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu du an')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteAdminProduct(id)
    setProjects((prev) => prev.filter((item) => item.id !== id))
    toast.success('Da xoa du an')
  }

  const openCreate = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-1 text-gray-600">CRUD du an dang doc va ghi truc tiep vao backend</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-primary hover:bg-brand-secondary">
          <Plus size={18} className="mr-2" />
          Them du an
        </Button>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="p-4 text-sm text-gray-600">
        Tong {projects.length} du an, trong do {showcaseProjects.length} du an dang xuat hien trong showcase.
      </Card>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const categoryNames = project.product_category?.map((item) => item.category.name).join(', ') || 'Chua gan danh muc'
            const isShowcase = showcaseNames.includes(project.name)

            return (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative h-44 bg-gray-100">
                  <Image src={project.image_url || '/placeholder.jpg'} alt={project.name} fill className="object-cover" />
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">{project.name}</h2>
                      <p className="text-xs text-gray-500">{categoryNames}</p>
                    </div>
                    {isShowcase ? <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Showcase</span> : null}
                  </div>

                  <p className="line-clamp-3 text-sm text-gray-600">{project.description}</p>

                  <div className="flex items-center justify-between">
                    {project.demo_url ? (
                      <a href={project.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary">
                        Xem demo
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Chua co demo</span>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(project)
                          setIsFormOpen(true)
                        }}
                        className="rounded p-1 text-brand-primary transition-colors hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <DeletePopover onDelete={() => handleDelete(project.id)} itemName={project.name} />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Plus size={48} />}
          title={isLoading ? 'Dang tai du lieu du an' : 'Chua co du an'}
          description={isLoading ? 'Vui long doi backend tra du lieu.' : 'Hay tao du an dau tien cho portfolio admin.'}
          action={!isLoading ? { label: 'Them du an', onClick: openCreate } : undefined}
        />
      )}

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProject(null)
        }}
        title={editingProject ? 'Cap nhat du an' : 'Them du an moi'}
        size="lg"
      >
        <PortfolioForm
          project={editingProject}
          categories={categories}
          services={services}
          onSave={handleSaveProject}
          isSubmitting={isSubmitting}
        />
      </SlideOver>
    </div>
  )
}
