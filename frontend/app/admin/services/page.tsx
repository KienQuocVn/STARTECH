'use client'

import { useEffect, useState } from 'react'
import { DollarSign, Edit2, Plus, Zap } from 'lucide-react'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    loadData().catch((err) => setError(err instanceof Error ? err.message : 'Khong the tai du lieu dich vu'))
  }, [])

  const saveService = async () => {
    try {
      if (editingService) {
        await updateAdminService(editingService.id, { name: serviceName })
        toast.success('Da cap nhat dich vu')
      } else {
        await createAdminService({ name: serviceName })
        toast.success('Da tao dich vu')
      }
      await loadData()
      setIsServiceFormOpen(false)
      setEditingService(null)
      setServiceName('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu dich vu')
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
      if (planForm.id) {
        await updateAdminPricingPlan(planForm.id, payload)
        toast.success('Da cap nhat goi gia')
      } else {
        await createAdminPricingPlan(payload)
        toast.success('Da tao goi gia')
      }
      await loadData()
      setIsPlanFormOpen(false)
      setPlanForm(buildPlanForm())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu goi gia')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Services & Pricing</h1>
        <p className="mt-1 text-gray-600">CRUD dich vu va bang gia dang noi vao live API</p>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Dich vu ({services.length})</h2>
            <Button
              onClick={() => {
                setEditingService(null)
                setServiceName('')
                setIsServiceFormOpen(true)
              }}
              className="bg-brand-primary hover:bg-brand-secondary"
            >
              <Plus size={16} className="mr-2" />
              Them dich vu
            </Button>
          </div>
          <div className="space-y-3">
            {services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id} className="border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-cyan-100 p-3 text-brand-accent">
                        <Zap size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-xs text-gray-500">ID #{service.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(service)
                          setServiceName(service.name)
                          setIsServiceFormOpen(true)
                        }}
                        className="rounded p-1 text-brand-primary hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
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
                  </div>
                </Card>
              ))
            ) : (
              <EmptyState icon={<Zap size={40} />} title="Chua co dich vu" description="Hay tao dich vu dau tien." />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Goi gia ({plans.length})</h2>
            <Button
              onClick={() => {
                setPlanForm(buildPlanForm())
                setIsPlanFormOpen(true)
              }}
              className="bg-brand-primary hover:bg-brand-secondary"
            >
              <Plus size={16} className="mr-2" />
              Them goi gia
            </Button>
          </div>
          <div className="space-y-3">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <Card key={plan.id} className="border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                          <DollarSign size={16} />
                        </div>
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      </div>
                      <p className="text-sm font-medium text-brand-primary">
                        {plan.price == null ? 'Lien he de bao gia' : `${plan.price.toLocaleString('vi-VN')} VND`}
                      </p>
                      {plan.description ? <p className="mt-2 text-sm text-gray-600">{plan.description}</p> : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.features.map((feature) => (
                          <span key={feature.id} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {feature.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPlanForm(buildPlanForm(plan))
                          setIsPlanFormOpen(true)
                        }}
                        className="rounded p-1 text-brand-primary hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <DeletePopover
                        onDelete={async () => {
                          await deleteAdminPricingPlan(plan.id)
                          await loadData()
                          toast.success('Da xoa goi gia')
                        }}
                        itemName={plan.name}
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <EmptyState icon={<DollarSign size={40} />} title="Chua co goi gia" description="Hay tao goi gia dau tien." />
            )}
          </div>
        </Card>
      </div>

      <SlideOver isOpen={isServiceFormOpen} onClose={() => setIsServiceFormOpen(false)} title={editingService ? 'Cap nhat dich vu' : 'Them dich vu'} size="sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceName">Ten dich vu</Label>
            <Input id="serviceName" value={serviceName} onChange={(event) => setServiceName(event.target.value)} className="mt-2" />
          </div>
          <Button onClick={saveService} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu dich vu
          </Button>
        </div>
      </SlideOver>

      <SlideOver isOpen={isPlanFormOpen} onClose={() => setIsPlanFormOpen(false)} title={planForm.id ? 'Cap nhat goi gia' : 'Them goi gia'} size="sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="planName">Ten goi</Label>
            <Input id="planName" value={planForm.name} onChange={(event) => setPlanForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="planDescription">Mo ta</Label>
            <textarea
              id="planDescription"
              value={planForm.description}
              onChange={(event) => setPlanForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="priceType">Loai gia</Label>
            <select
              id="priceType"
              value={planForm.price_Type}
              onChange={(event) => setPlanForm((prev) => ({ ...prev, price_Type: event.target.value as 'FIXED' | 'CONTACT' }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="FIXED">Co gia</option>
              <option value="CONTACT">Lien he</option>
            </select>
          </div>
          <div>
            <Label htmlFor="price">Gia</Label>
            <Input id="price" type="number" disabled={planForm.price_Type === 'CONTACT'} value={planForm.price} onChange={(event) => setPlanForm((prev) => ({ ...prev, price: event.target.value }))} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="featureNames">Features, moi dong mot muc</Label>
            <textarea
              id="featureNames"
              value={planForm.featureNames}
              onChange={(event) => setPlanForm((prev) => ({ ...prev, featureNames: event.target.value }))}
              className="mt-2 min-h-32 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={savePlan} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu goi gia
          </Button>
        </div>
      </SlideOver>
    </div>
  )
}
