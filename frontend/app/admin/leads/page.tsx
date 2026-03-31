'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, Search } from 'lucide-react';
import { EmptyState } from '@/components/admin/EmptyState';
import { SlideOver } from '@/components/admin/SlideOver';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  deleteContactLead,
  getContactLeads,
  updateContactLeadStatus,
  type ContactLead,
} from '@/lib/services/contact';
import { toast } from 'sonner';

type LeadStatus = 'new' | 'processing' | 'completed';

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

function mapLeadStatus(status: ContactLead['status']): LeadStatus {
  if (status === 'WAITING') return 'new';
  if (status === 'VIEWED') return 'processing';
  return 'completed';
}

function mapApiLead(lead: ContactLead): Lead {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    service: lead.service || 'Tư vấn tổng quan',
    message: lead.message,
    status: mapLeadStatus(lead.status),
    createdAt: lead.createdAt,
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getContactLeads()
      .then((response) => {
        if (!active) return;
        setLeads((response.data ?? []).map(mapApiLead));
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Không thể tải lead từ backend');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredLeads = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      if (!term) return true;
      const haystack = `${lead.name} ${lead.email} ${lead.phone} ${lead.service} ${lead.company || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [leads, searchQuery]);

  const updateStatus = async (lead: Lead, nextStatus: LeadStatus) => {
    const mappedStatus =
      nextStatus === 'new' ? 'WAITING' : nextStatus === 'processing' ? 'VIEWED' : 'PROCESSED';

    try {
      await updateContactLeadStatus(lead.id, mappedStatus);
      setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, status: nextStatus } : item)));
      setSelectedLead((prev) => (prev?.id === lead.id ? { ...prev, status: nextStatus } : prev));
      toast.success('Đã cập nhật trạng thái lead');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật lead');
    }
  };

  const exportCsv = () => {
    const rows = leads
      .map((lead) => `${lead.name},${lead.email},${lead.phone},${lead.service},${lead.status}`)
      .join('\n');
    const blob = new Blob([`Name,Email,Phone,Service,Status\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'startech-leads.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại, dịch vụ..."
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <Button onClick={exportCsv} variant="outline">
            <Download size={18} className="mr-2" />
            Xuất CSV
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filteredLeads.length > 0 ? (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="px-5 py-4">Khách hàng</TableHead>
                <TableHead className="py-4">Liên hệ</TableHead>
                <TableHead className="py-4">Dịch vụ</TableHead>
                <TableHead className="py-4">Trạng thái</TableHead>
                <TableHead className="py-4">Tạo lúc</TableHead>
                <TableHead className="py-4 text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsDetailOpen(true);
                  }}
                >
                  <TableCell className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-950">{lead.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{lead.company || 'Không có công ty'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-slate-600">
                    <div className="space-y-1">
                      <p>{lead.email}</p>
                      <p>{lead.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[260px] py-4 text-sm text-slate-600">
                    <div className="line-clamp-2">{lead.service}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="py-4 text-sm text-slate-500">
                    {new Date(lead.createdAt).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right">
                    <button className="rounded p-2 text-brand-primary transition-colors hover:bg-blue-50">
                      <Eye size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={<Search size={40} />}
              title={isLoading ? 'Đang tải lead' : 'Không có lead phù hợp'}
              description={
                isLoading
                  ? 'Vui lòng đợi hệ thống đồng bộ dữ liệu.'
                  : 'Thử xóa bộ lọc hoặc chờ lead mới từ website.'
              }
            />
          </div>
        )}
      </Card>

      <SlideOver isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Chi tiết lead" size="md">
        {selectedLead ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500">Khách hàng</p>
                <p className="text-lg font-semibold text-gray-900">{selectedLead.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Email</p>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Điện thoại</p>
                  <p>{selectedLead.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Dịch vụ</p>
                <p className="text-sm text-gray-700">{selectedLead.service}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Công ty</p>
                <p className="text-sm text-gray-700">{selectedLead.company || 'Không có'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">Tin nhắn</p>
              <div className="mt-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{selectedLead.message}</div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">Trạng thái</p>
              <div className="flex gap-2">
                {(['new', 'processing', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedLead, status)}
                    className={`rounded px-3 py-2 text-sm font-medium ${
                      selectedLead.status === status
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'new' ? 'Mới' : status === 'processing' ? 'Đang xử lý' : 'Hoàn tất'}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-600"
              onClick={async () => {
                try {
                  await deleteContactLead(selectedLead.id);
                  setLeads((prev) => prev.filter((lead) => lead.id !== selectedLead.id));
                  setIsDetailOpen(false);
                  toast.success('Đã xóa lead');
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Không thể xóa lead');
                }
              }}
            >
              Xóa lead
            </Button>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
