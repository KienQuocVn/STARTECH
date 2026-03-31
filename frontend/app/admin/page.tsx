'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, FileText, FolderOpen, MessageCircle, Star, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { KPICard } from '@/components/admin/KPICard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Card } from '@/components/ui/card'
import { getContactLeads, type ContactLead } from '@/lib/services/contact'
import { getFeedbacks } from '@/lib/services/feedback'
import { getProducts, type Product } from '@/lib/services/product'
import { getAdminSitePages, type SitePageContent } from '@/lib/services/site-content'

type DashboardState = {
  leads: ContactLead[]
  products: Product[]
  feedbackCount: number
  pages: SitePageContent[]
}

const EMPTY_STATE: DashboardState = {
  leads: [],
  products: [],
  feedbackCount: 0,
  pages: [],
}

function getMonthLabel(monthIndex: number) {
  return `T${monthIndex + 1}`
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardState>(EMPTY_STATE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    Promise.all([
      getContactLeads(),
      getProducts({ page: 1, limit: 100 }),
      getFeedbacks({ page: 1, limit: 1 }),
      getAdminSitePages(),
    ])
      .then(([leadsResponse, productsResponse, feedbackResponse, pagesResponse]) => {
        if (!active) return

        setData({
          leads: leadsResponse.data ?? [],
          products: productsResponse.data?.items ?? [],
          feedbackCount: feedbackResponse.data?.total ?? feedbackResponse.data?.items?.length ?? 0,
          pages: pagesResponse.data ?? [],
        })
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Khong the tai dashboard')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const monthlyChartData = useMemo(() => {
    const year = new Date().getFullYear()
    const rows = Array.from({ length: 12 }, (_, index) => ({
      month: getMonthLabel(index),
      leads: 0,
      projects: 0,
    }))

    data.leads.forEach((lead) => {
      const date = new Date(lead.createdAt)
      if (date.getFullYear() === year) rows[date.getMonth()].leads += 1
    })

    data.products.forEach((product) => {
      const date = new Date(product.createdAt ?? new Date().toISOString())
      if (date.getFullYear() === year) rows[date.getMonth()].projects += 1
    })

    return rows
  }, [data.leads, data.products])

  const recentLeads = useMemo(
    () =>
      [...data.leads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [data.leads],
  )

  const newLeadsCount = data.leads.filter((lead) => lead.status === 'WAITING').length

  return (
    <div className="space-y-6">
      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Leads moi" value={newLeadsCount} icon={<MessageCircle size={24} />} color="blue" />
        <KPICard label="Du an" value={data.products.length} icon={<FolderOpen size={24} />} color="teal" />
        <KPICard label="Feedback" value={data.feedbackCount} icon={<Users size={24} />} color="green" />
        <KPICard label="CMS Pages" value={data.pages.length} icon={<FileText size={24} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
        <Card className="rounded-[28px] border-slate-200 p-6 shadow-lg shadow-slate-200/60">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Leads va du an theo thang</h2>
              <p className="mt-1 text-sm text-slate-500">Du lieu tong hop tu backend theo nam hien tai</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Yearly</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#1a63a8" name="Leads" />
              <Bar dataKey="projects" fill="#80d8f9" name="Du an" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-slate-200 p-6 shadow-lg shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Leads gan day</h2>
                <p className="mt-1 text-sm text-slate-500">Danh sach lead moi nhat can theo doi</p>
              </div>
              <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
                Xem tat ca
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <span className="font-semibold text-slate-950">{lead.name}</span>
                      <StatusBadge
                        status={lead.status === 'WAITING' ? 'new' : lead.status === 'VIEWED' ? 'processing' : 'completed'}
                      />
                    </div>
                    <p className="text-sm text-slate-600">{lead.service || 'Tu van tong quan'}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">{isLoading ? 'Dang tai du lieu...' : 'Chua co lead tu backend.'}</p>
              )}
            </div>
          </Card>

          <Card className="rounded-[28px] border-slate-200 p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-slate-950">Nhanh trong ngay</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2 text-amber-500">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">Feedback hien co</p>
                    <p className="text-sm text-slate-500">Danh gia cua khach hang</p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-slate-950">{data.feedbackCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2 text-emerald-500">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">Lead chua doc</p>
                    <p className="text-sm text-slate-500">Can xu ly uu tien</p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-slate-950">{newLeadsCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
