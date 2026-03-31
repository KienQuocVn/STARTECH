'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Edit2, Eye, Plus } from 'lucide-react'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import PortfolioForm, { type PortfolioFormValue } from '@/components/admin/PortfolioForm'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

type ModalMode = 'create' | 'view' | 'edit'

const PAGE_SIZE = 8

function shortenServiceName(value: string) {
  const normalized = value.trim()
  if (normalized.length <= 22) return normalized
  return `${normalized.slice(0, 22)}...`
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [services, setServices] = useState<CatalogService[]>([])
  const [showcaseNames, setShowcaseNames] = useState<string[]>([])
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [selectedProject, setSelectedProject] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showcaseFilter, setShowcaseFilter] = useState('all')
  const [page, setPage] = useState(1)

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

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase()

    return projects.filter((project) => {
      const categoryIds = project.product_category?.map((item) => String(item.category.id)) ?? []
      const categoryNames = project.product_category?.map((item) => item.category.name.toLowerCase()) ?? []
      const serviceNames = project.product_service?.map((item) => item.service.name.toLowerCase()) ?? []
      const isShowcase = showcaseNames.includes(project.name)

      const matchesSearch =
        !term ||
        project.name.toLowerCase().includes(term) ||
        (project.slug ?? '').toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        categoryNames.some((item) => item.includes(term)) ||
        serviceNames.some((item) => item.includes(term))

      const matchesCategory =
        categoryFilter === 'all' || categoryIds.includes(categoryFilter)

      const matchesShowcase =
        showcaseFilter === 'all' ||
        (showcaseFilter === 'showcase' && isShowcase) ||
        (showcaseFilter === 'normal' && !isShowcase)

      return matchesSearch && matchesCategory && matchesShowcase
    })
  }, [categoryFilter, projects, search, showcaseFilter, showcaseNames])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE))
  const paginatedProjects = filteredProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter, showcaseFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

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
      if (modalMode === 'edit' && selectedProject) {
        await updateAdminProduct(selectedProject.id, payload)
        toast.success('Da cap nhat du an')
      } else {
        await createAdminProduct(payload)
        toast.success('Da tao du an moi')
      }

      await loadData()
      setIsFormOpen(false)
      setSelectedProject(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu dự án')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteAdminProduct(id)
    setProjects((prev) => prev.filter((item) => item.id !== id))
    toast.success('Đã xóa dự án')
  }

  const openModal = (mode: ModalMode, project?: Product | null) => {
    setModalMode(mode)
    setSelectedProject(project ?? null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Portfolio"
        description="Tất cả sản phẩm/dự án được đưa về dạng table để quản lý tập trung, có tìm kiếm, bộ lọc và phân trang rõ ràng."
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, slug, mô tả, danh mục, dịch vụ..."
        filters={
          <>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={showcaseFilter}
              onChange={(event) => setShowcaseFilter(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="showcase">Đang trong showcase</option>
              <option value="normal">Portfolio thường</option>
            </select>
          </>
        }
        action={
          <Button onClick={() => openModal('create')} className="h-11 rounded-2xl bg-blue-600 px-5 text-white hover:bg-blue-700">
            <Plus size={18} className="mr-2" />
            Thêm dự án
          </Button>
        }
      />

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="overflow-hidden rounded-[30px] border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Bảng dự án</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tổng {projects.length} dự án, {showcaseNames.length} mục đang được sử dụng trong showcase.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Kết quả: {filteredProjects.length}
          </div>
        </div>

        {paginatedProjects.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200 hover:bg-slate-50">
                  <TableHead className="px-5 py-4">Dự án</TableHead>
                  <TableHead className="py-4">Danh mục</TableHead>
                  <TableHead className="py-4">Dịch vụ</TableHead>
                  <TableHead className="py-4">Giá</TableHead>
                  <TableHead className="py-4">Cập nhật</TableHead>
                  <TableHead className="py-4 text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.map((project) => {
                  const isShowcase = showcaseNames.includes(project.name)
                  const categoryNames = project.product_category?.map((item) => item.category.name).join(', ') || 'Chua gan'
                  const serviceItems = project.product_service?.map((item) => item.service.name) ?? []
                  const visibleServiceItems = serviceItems.slice(0, 2)
                  const extraServiceCount = Math.max(0, serviceItems.length - visibleServiceItems.length)

                  return (
                    <TableRow key={project.id} className="border-slate-200">
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-16 overflow-hidden rounded-2xl bg-slate-100">
                            <Image src={project.image_url || '/placeholder.jpg'} alt={project.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-950">{project.name}</p>
                            <p className="mt-1 truncate text-xs text-slate-500">/{project.slug || 'chua-co-slug'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] py-4 text-sm text-slate-600">{categoryNames}</TableCell>
                      <TableCell className="max-w-[240px] py-4 text-sm text-slate-600">
                        {serviceItems.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {visibleServiceItems.map((serviceName) => (
                              <span
                                key={serviceName}
                                title={serviceName}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                              >
                                {shortenServiceName(serviceName)}
                              </span>
                            ))}
                            {extraServiceCount > 0 ? (
                              <span
                                title={serviceItems.slice(visibleServiceItems.length).join(', ')}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                              >
                                +{extraServiceCount}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          'Chua gan'
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-slate-700">
                        {project.price_Type === 'FIXED' && project.price ? `${Number(project.price).toLocaleString('vi-VN')} VND` : 'Liên hệ'}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-500">
                        {new Date(project.updatedAt ?? project.createdAt ?? new Date().toISOString()).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isShowcase ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isShowcase ? 'Showcase' : 'Live'}
                          </span>
                          <button
                            onClick={() => openModal('view', project)}
                            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openModal('edit', project)}
                            className="rounded-full border border-blue-200 p-2 text-blue-500 transition hover:bg-blue-50"
                          >
                            <Edit2 size={18} />
                          </button>
                          <DeletePopover onDelete={() => handleDelete(project.id)} itemName={project.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <AdminPagination page={page} totalPages={totalPages} totalItems={filteredProjects.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={<Plus size={48} />}
              title={isLoading ? 'Đang tải dữ liệu dự án' : 'Không có dự án phù hợp'}
              description={isLoading ? 'Vui lòng đợi backend trả dữ liệu.' : 'Thử đổi bộ lọc hoặc tạo dự án mới.'}
              action={!isLoading ? { label: 'Thêm dự án', onClick: () => openModal('create') } : undefined}
            />
          </div>
        )}
      </Card>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedProject(null)
        }}
        title={modalMode === 'create' ? 'Thêm dự án mới' : modalMode === 'edit' ? 'Cập nhật dự án' : 'Xem chi tiết dự án'}
        size="lg"
      >
        <PortfolioForm
          project={selectedProject}
          categories={categories}
          services={services}
          onSave={handleSaveProject}
          isSubmitting={isSubmitting}
          readOnly={modalMode === 'view'}
        />
      </SlideOver>
    </div>
  )
}
