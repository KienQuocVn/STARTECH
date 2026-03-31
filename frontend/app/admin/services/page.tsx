'use client'

import { useEffect, useMemo, useState } from 'react'
import { DollarSign, Edit2, Eye, Plus, Zap } from 'lucide-react'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  createAdminPricingPlan,
  deleteAdminPricingPlan,
  getPricingPlans,
  updateAdminPricingPlan,
  type PricingPlan,
} from '@/lib/services/pricing-plan'
import {
  createAdminService,
  deleteAdminService,
  getServicesCatalog,
  updateAdminService,
  type CatalogService,
} from '@/lib/services/service-catalog'
import { toast } from 'sonner'

type PricingPlanForm = {
  id?: number
  name: string
  description: string
  price_Type: 'FIXED' | 'CONTACT'
  price: string
  featureNames: string
}

type ModalMode = 'create' | 'view' | 'edit'

const PAGE_SIZE = 8

function buildPlanForm(plan?: PricingPlan | null): PricingPlanForm {
  return {
    id: plan?.id,
    name: plan?.name ?? '',
    description: plan?.description ?? '',
    price_Type: plan?.price_Type ?? (plan?.price == null ? 'CONTACT' : 'FIXED'),
    price: plan?.price != null ? String(plan.price) : '',
    featureNames: plan?.features?.map((feature) => feature.name).join('\n') ?? '',
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<CatalogService[]>([])
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [serviceSearch, setServiceSearch] = useState('')
  const [planSearch, setPlanSearch] = useState('')
  const [planTypeFilter, setPlanTypeFilter] = useState('all')
  const [servicePage, setServicePage] = useState(1)
  const [planPage, setPlanPage] = useState(1)
  const [serviceModalMode, setServiceModalMode] = useState<ModalMode>('create')
  const [planModalMode, setPlanModalMode] = useState<ModalMode>('create')
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false)
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [editingService, setEditingService] = useState<CatalogService | null>(null)
  const [planForm, setPlanForm] = useState<PricingPlanForm>(buildPlanForm())
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    const [servicesResponse, pricingResponse] = await Promise.all([getServicesCatalog(), getPricingPlans()])
    setServices(servicesResponse.data ?? [])
    setPlans(pricingResponse.data ?? [])
  }

  useEffect(() => {
    loadData().catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu'))
  }, [])

  const filteredServices = useMemo(() => {
    const term = serviceSearch.trim().toLowerCase()
    return services.filter((service) => !term || service.name.toLowerCase().includes(term))
  }, [serviceSearch, services])

  const filteredPlans = useMemo(() => {
    const term = planSearch.trim().toLowerCase()
    return plans.filter((plan) => {
      const matchesSearch =
        !term ||
        plan.name.toLowerCase().includes(term) ||
        (plan.description ?? '').toLowerCase().includes(term) ||
        plan.features.some((feature) => feature.name.toLowerCase().includes(term))
      const matchesType =
        planTypeFilter === 'all' ||
        (planTypeFilter === 'contact' && (plan.price_Type === 'CONTACT' || plan.price == null)) ||
        (planTypeFilter === 'fixed' && (plan.price_Type === 'FIXED' || plan.price != null))
      return matchesSearch && matchesType
    })
  }, [planSearch, planTypeFilter, plans])

  const serviceTotalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE))
  const planTotalPages = Math.max(1, Math.ceil(filteredPlans.length / PAGE_SIZE))
  const paginatedServices = filteredServices.slice((servicePage - 1) * PAGE_SIZE, servicePage * PAGE_SIZE)
  const paginatedPlans = filteredPlans.slice((planPage - 1) * PAGE_SIZE, planPage * PAGE_SIZE)

  useEffect(() => {
    setServicePage(1)
  }, [serviceSearch])

  useEffect(() => {
    setPlanPage(1)
  }, [planSearch, planTypeFilter])

  useEffect(() => {
    if (servicePage > serviceTotalPages) setServicePage(serviceTotalPages)
  }, [servicePage, serviceTotalPages])

  useEffect(() => {
    if (planPage > planTotalPages) setPlanPage(planTotalPages)
  }, [planPage, planTotalPages])

  const saveService = async () => {
    try {
      if (serviceModalMode === 'edit' && editingService) {
        await updateAdminService(editingService.id, { name: serviceName })
        toast.success('Đã cập nhật dịch vụ')
      } else {
        await createAdminService({ name: serviceName })
        toast.success('Đã tạo dịch vụ')
      }
      await loadData()
      setIsServiceFormOpen(false)
      setEditingService(null)
      setServiceName('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu dịch vụ')
    }
  }

  const savePlan = async () => {
    const payload = {
      name: planForm.name,
      description: planForm.description || null,
      price_Type: planForm.price_Type,
      price: planForm.price_Type === 'FIXED' && planForm.price ? Number(planForm.price) : null,
      featureNames: planForm.featureNames
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    try {
      if (planModalMode === 'edit' && planForm.id) {
        await updateAdminPricingPlan(planForm.id, payload)
        toast.success('Đã cập nhật gói giá')
      } else {
        await createAdminPricingPlan(payload)
        toast.success('Đã tạo gói giá')
      }
      await loadData()
      setIsPlanFormOpen(false)
      setPlanForm(buildPlanForm())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu gói giá')
    }
  }

  const openServiceModal = (mode: ModalMode, service?: CatalogService) => {
    setServiceModalMode(mode)
    setEditingService(service ?? null)
    setServiceName(service?.name ?? '')
    setIsServiceFormOpen(true)
  }

  const openPlanModal = (mode: ModalMode, plan?: PricingPlan) => {
    setPlanModalMode(mode)
    setPlanForm(buildPlanForm(plan))
    setIsPlanFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Services"
        description="Quản lý cả danh mục dịch vụ và bảng giá trong một giao diện table. Mỗi khu vực đều có tìm kiếm, lọc và phân trang riêng."
        searchValue={serviceSearch}
        onSearchChange={setServiceSearch}
        searchPlaceholder="Tìm nhanh tên dịch vụ..."
        action={
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => openServiceModal('create')} className="h-11 rounded-2xl bg-blue-600 px-5 text-white hover:bg-blue-700">
              <Plus size={18} className="mr-2" />
              Thêm dịch vụ
            </Button>
            <Button onClick={() => openPlanModal('create')} variant="outline" className="h-11 rounded-2xl border-slate-200 px-5">
              <Plus size={18} className="mr-2" />
              Thêm gói giá
            </Button>
          </div>
        }
      />

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <div className="space-y-6">
        <Card className="overflow-hidden rounded-[30px] border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="space-y-4 border-b border-slate-200 px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Danh mục dịch vụ</h2>
                <p className="mt-1 text-sm text-slate-500">Dữ liệu dùng cho portfolio và các khối nội dung dịch vụ.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">{filteredServices.length} mục</div>
            </div>
            <Input
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
              placeholder="Tìm tên dịch vụ..."
              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
            />
          </div>

          {paginatedServices.length > 0 ? (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200 hover:bg-slate-50">
                    <TableHead className="px-5 py-4">Dịch vụ</TableHead>
                    <TableHead className="py-4">Mô tả</TableHead>
                    <TableHead className="py-4 text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedServices.map((service) => (
                    <TableRow key={service.id} className="border-slate-200">
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                            <Zap size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">{service.name}</p>
                            <p className="mt-1 text-xs text-slate-500">ID #{service.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-500">Được sử dụng trong bộ lọc dự án và nội dung hiển thị.</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
                          <button
                            onClick={() => openServiceModal('view', service)}
                            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openServiceModal('edit', service)}
                            className="rounded-full border border-blue-200 p-2 text-blue-500 transition hover:bg-blue-50"
                          >
                            <Edit2 size={18} />
                          </button>
                          <DeletePopover
                            onDelete={async () => {
                              await deleteAdminService(service.id)
                              await loadData()
                              toast.success('Da xoa dich vu')
                            }}
                            itemName={service.name}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <AdminPagination page={servicePage} totalPages={serviceTotalPages} totalItems={filteredServices.length} pageSize={PAGE_SIZE} onPageChange={setServicePage} />
            </>
          ) : (
            <div className="p-6">
              <EmptyState icon={<Zap size={40} />} title="Khong co dich vu phu hop" description="Thu tim lai hoac tao dich vu moi." />
            </div>
          )}
        </Card>

        <Card className="overflow-hidden rounded-[30px] border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="space-y-4 border-b border-slate-200 px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Bảng giá</h2>
                <p className="mt-1 text-sm text-slate-500">Quản lý gói giá theo hình thức liên hệ hoặc bảng giá cố định.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">{filteredPlans.length} mục</div>
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <Input
                value={planSearch}
                onChange={(event) => setPlanSearch(event.target.value)}
                placeholder="Tim goi gia, feature..."
                className="h-11 rounded-2xl border-slate-200 bg-slate-50"
              />
              <select
                value={planTypeFilter}
                onChange={(event) => setPlanTypeFilter(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
              >
                <option value="all">ất cả loại giá</option>
                <option value="fixed">Cố định</option>
                <option value="contact">Liên hệ</option>
              </select>
            </div>
          </div>

          {paginatedPlans.length > 0 ? (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200 hover:bg-slate-50">
                    <TableHead className="px-5 py-4">ói giá</TableHead>
                    <TableHead className="py-4">Giá</TableHead>
                    <TableHead className="py-4">Đặc trưng</TableHead>
                    <TableHead className="py-4 text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPlans.map((plan) => (
                    <TableRow key={plan.id} className="border-slate-200">
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">{plan.name}</p>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{plan.description || 'Chưa có mô tả'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-slate-700">
                        {plan.price == null ? 'Liên hệ để báo giá' : `${plan.price.toLocaleString('vi-VN')} VND`}
                      </TableCell>
                      <TableCell className="max-w-[260px] py-4 text-sm text-slate-500">
                        <div className="line-clamp-2">{plan.features.map((feature) => feature.name).join(', ') || 'Chưa có feature'}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${plan.price == null ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {plan.price == null ? 'Liên hệ' : 'Có giá'}
                          </span>
                          <button
                            onClick={() => openPlanModal('view', plan)}
                            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openPlanModal('edit', plan)}
                            className="rounded-full border border-blue-200 p-2 text-blue-500 transition hover:bg-blue-50"
                          >
                            <Edit2 size={18} />
                          </button>
                          <DeletePopover
                            onDelete={async () => {
                              await deleteAdminPricingPlan(plan.id)
                              await loadData()
                              toast.success('Đã xóa gói giá')
                            }}
                            itemName={plan.name}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <AdminPagination page={planPage} totalPages={planTotalPages} totalItems={filteredPlans.length} pageSize={PAGE_SIZE} onPageChange={setPlanPage} />
            </>
          ) : (
            <div className="p-6">
              <EmptyState icon={<DollarSign size={40} />} title="Không có gói giá phù hợp" description="Thử tìm lại hoặc tạo gói giá mới." />
            </div>
          )}
        </Card>
      </div>

      <SlideOver
        isOpen={isServiceFormOpen}
        onClose={() => setIsServiceFormOpen(false)}
        title={serviceModalMode === 'create' ? 'Thêm dịch vụ' : serviceModalMode === 'edit' ? 'ập nhật dịch vụ' : 'Xem dịch vụ'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceName">Tên dịch vụ</Label>
            <Input
              id="serviceName"
              value={serviceName}
              disabled={serviceModalMode === 'view'}
              onChange={(event) => setServiceName(event.target.value)}
              className="mt-2"
            />
          </div>
          {serviceModalMode !== 'view' ? (
            <Button onClick={saveService} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Lưu dịch vụ
            </Button>
          ) : null}
        </div>
      </SlideOver>

      <SlideOver
        isOpen={isPlanFormOpen}
        onClose={() => setIsPlanFormOpen(false)}
        title={planModalMode === 'create' ? 'Thêm gói giá' : planModalMode === 'edit' ? 'ập nhật gói giá' : 'Xem gói giá'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="planName">Tên gói</Label>
            <Input id="planName" value={planForm.name} disabled={planModalMode === 'view'} onChange={(event) => setPlanForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="planDescription">Mô tả</Label>
            <Textarea id="planDescription" value={planForm.description} disabled={planModalMode === 'view'} onChange={(event) => setPlanForm((prev) => ({ ...prev, description: event.target.value }))} className="mt-2 min-h-24" />
          </div>
          <div>
            <Label htmlFor="priceType">Loại giá</Label>
            <select
              id="priceType"
              value={planForm.price_Type}
              disabled={planModalMode === 'view'}
              onChange={(event) => setPlanForm((prev) => ({ ...prev, price_Type: event.target.value as 'FIXED' | 'CONTACT' }))}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="FIXED">Có giá</option>
              <option value="CONTACT">Liên hệ</option>
            </select>
          </div>
          <div>
            <Label htmlFor="price">Giá</Label>
            <Input id="price" type="number" disabled={planModalMode === 'view' || planForm.price_Type === 'CONTACT'} value={planForm.price} onChange={(event) => setPlanForm((prev) => ({ ...prev, price: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="featureNames">Features, mỗi dòng một mục</Label>
            <Textarea id="featureNames" value={planForm.featureNames} disabled={planModalMode === 'view'} onChange={(event) => setPlanForm((prev) => ({ ...prev, featureNames: event.target.value }))} className="mt-2 min-h-32" />
          </div>
          {planModalMode !== 'view' ? (
            <Button onClick={savePlan} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Lưu gói giá
            </Button>
          ) : null}
        </div>
      </SlideOver>
    </div>
  )
}
