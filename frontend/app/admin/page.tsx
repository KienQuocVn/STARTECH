'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileText, FolderOpen, MessageCircle, Users } from 'lucide-react'
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Tong quan he thong admin dang lay tu backend</p>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Leads moi" value={newLeadsCount} icon={<MessageCircle size={24} />} color="blue" />
        <KPICard label="Du an" value={data.products.length} icon={<FolderOpen size={24} />} color="teal" />
        <KPICard label="Feedback" value={data.feedbackCount} icon={<Users size={24} />} color="green" />
        <KPICard label="CMS Pages" value={data.pages.length} icon={<FileText size={24} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Leads va du an theo thang</h2>
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

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Leads gan day</h2>
          <div className="space-y-3">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <span className="font-semibold text-gray-900">{lead.name}</span>
                    <StatusBadge
                      status={lead.status === 'WAITING' ? 'new' : lead.status === 'VIEWED' ? 'processing' : 'completed'}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{lead.service || 'Tu van tong quan'}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(lead.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">{isLoading ? 'Dang tai du lieu...' : 'Chua co lead tu backend.'}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
