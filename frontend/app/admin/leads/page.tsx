'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Eye, Search } from 'lucide-react'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  deleteContactLead,
  getContactLeads,
  updateContactLeadStatus,
  type ContactLead,
} from '@/lib/services/contact'
import { toast } from 'sonner'

type LeadStatus = 'new' | 'processing' | 'completed'

type Lead = {
  id: number
  name: string
  email: string
  phone: string
  company?: string | null
  service: string
  message: string
  status: LeadStatus
  createdAt: string
}

function mapLeadStatus(status: ContactLead['status']): LeadStatus {
  if (status === 'WAITING') return 'new'
  if (status === 'VIEWED') return 'processing'
  return 'completed'
}

function mapApiLead(lead: ContactLead): Lead {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    service: lead.service || 'Tu van tong quan',
    message: lead.message,
    status: mapLeadStatus(lead.status),
    createdAt: lead.createdAt,
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getContactLeads()
      .then((response) => {
        if (!active) return
        setLeads((response.data ?? []).map(mapApiLead))
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Khong the tai lead tu backend')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filterLeads = useMemo(
    () => (status?: 'all' | LeadStatus) => {
      return leads.filter((lead) => {
        const matchesStatus = !status || status === 'all' ? true : lead.status === status
        const haystack = `${lead.name} ${lead.email} ${lead.service}`.toLowerCase()
        const matchesSearch = searchQuery ? haystack.includes(searchQuery.toLowerCase()) : true
        return matchesStatus && matchesSearch
      })
    },
    [leads, searchQuery],
  )

  const updateStatus = async (lead: Lead, nextStatus: LeadStatus) => {
    const mappedStatus = nextStatus === 'new' ? 'WAITING' : nextStatus === 'processing' ? 'VIEWED' : 'PROCESSED'

    try {
      await updateContactLeadStatus(lead.id, mappedStatus)
      setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, status: nextStatus } : item)))
      setSelectedLead((prev) => (prev?.id === lead.id ? { ...prev, status: nextStatus } : prev))
      toast.success('Da cap nhat trang thai lead')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the cap nhat lead')
    }
  }

  const exportCsv = () => {
    const rows = leads.map((lead) => `${lead.name},${lead.email},${lead.phone},${lead.service},${lead.status}`).join('\n')
    const blob = new Blob([`Name,Email,Phone,Service,Status\n${rows}`], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'startech-leads.csv'
    anchor.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-gray-600">Danh sach lead dang doc truc tiep tu backend</p>
        </div>
        <Button onClick={exportCsv} variant="outline">
          <Download size={18} className="mr-2" />
          Xuat CSV
        </Button>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tim theo ten, email, dich vu..." className="border-0 focus-visible:ring-0" />
        </div>
      </Card>

      {(['all', 'new', 'processing', 'completed'] as const).map((status) => (
        <section key={status} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {status === 'all' ? 'Tat ca' : status === 'new' ? 'Moi' : status === 'processing' ? 'Dang xu ly' : 'Hoan tat'} ({filterLeads(status).length})
          </h2>

          {filterLeads(status).length > 0 ? (
            filterLeads(status).map((lead) => (
              <Card key={lead.id} className="cursor-pointer p-4 transition-all hover:shadow-card-hover" onClick={() => {
                setSelectedLead(lead)
                setIsDetailOpen(true)
              }}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-3">
                      <span>{lead.email}</span>
                      <span>{lead.phone}</span>
                      <span>{lead.service}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{new Date(lead.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <button className="rounded p-2 text-brand-primary transition-colors hover:bg-blue-50">
                    <Eye size={18} />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={<Search size={40} />}
              title={isLoading ? 'Dang tai lead' : 'Khong co lead phu hop'}
              description={isLoading ? 'Vui long doi he thong dong bo du lieu.' : 'Thu doi bo loc hoac cho lead moi tu website.'}
            />
          )}
        </section>
      ))}

      <SlideOver isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Chi tiet lead" size="md">
        {selectedLead ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500">Khach hang</p>
                <p className="text-lg font-semibold text-gray-900">{selectedLead.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Email</p>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Dien thoai</p>
                  <p>{selectedLead.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Dich vu</p>
                <p className="text-sm text-gray-700">{selectedLead.service}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Cong ty</p>
                <p className="text-sm text-gray-700">{selectedLead.company || 'Khong co'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">Tin nhan</p>
              <div className="mt-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{selectedLead.message}</div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">Trang thai</p>
              <div className="flex gap-2">
                {(['new', 'processing', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedLead, status)}
                    className={`rounded px-3 py-2 text-sm font-medium ${
                      selectedLead.status === status ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'new' ? 'Moi' : status === 'processing' ? 'Dang xu ly' : 'Hoan tat'}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-600"
              onClick={async () => {
                try {
                  await deleteContactLead(selectedLead.id)
                  setLeads((prev) => prev.filter((lead) => lead.id !== selectedLead.id))
                  setIsDetailOpen(false)
                  toast.success('Da xoa lead')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Khong the xoa lead')
                }
              }}
            >
              Xoa lead
            </Button>
          </div>
        ) : null}
      </SlideOver>
    </div>
  )
}
