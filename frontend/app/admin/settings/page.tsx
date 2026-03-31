'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getAdminSiteSettings, updateAdminSiteSettings, type SiteSettingsMap } from '@/lib/services/site-settings'

type SettingsFormState = {
  public_navigation: string
  public_footer: string
  public_contact_form: string
}

function stringifySetting(value: unknown) {
  return value ? JSON.stringify(value, null, 2) : ''
}

function buildForm(settings?: SiteSettingsMap): SettingsFormState {
  return {
    public_navigation: stringifySetting(settings?.public_navigation),
    public_footer: stringifySetting(settings?.public_footer),
    public_contact_form: stringifySetting(settings?.public_contact_form),
  }
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsFormState>(buildForm())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    getAdminSiteSettings()
      .then((response) => {
        if (!active) return
        setForm(buildForm(response.data))
      })
      .catch((error) => {
        if (!active) return
        toast.error(error instanceof Error ? error.message : 'Không thể tải cài đặt trang web')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const saveSettings = async () => {
    try {
      await updateAdminSiteSettings({
        public_navigation: form.public_navigation.trim() ? JSON.parse(form.public_navigation) : null,
        public_footer: form.public_footer.trim() ? JSON.parse(form.public_footer) : null,
        public_contact_form: form.public_contact_form.trim() ? JSON.parse(form.public_contact_form) : null,
      })
      toast.success('Đã cập nhật cài đặt trang web')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật cài đặt trang web')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-slate-200 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">Cài đặt trang web</h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý dữ liệu global cho menu, footer và form liên hệ. Frontend public sẽ tải trực tiếp từ backend.
            </p>
          </div>
          <Button onClick={saveSettings} disabled={isLoading} className="gap-2">
            <Save size={16} />
            Lưu cài đặt
          </Button>
        </div>
      </Card>

      {(
        [
          ['public_navigation', 'Menu điều hướng'],
          ['public_footer', 'Footer'],
          ['public_contact_form', 'Form liên hệ'],
        ] as const
      ).map(([key, label]) => (
        <Card key={key} className="rounded-[28px] border-slate-200 p-6 shadow-lg shadow-slate-200/60">
          <label className="text-sm font-semibold text-slate-900">{label}</label>
          <textarea
            value={form[key]}
            onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
            className="mt-3 min-h-[280px] w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-xs text-slate-700"
            placeholder="{}"
          />
        </Card>
      ))}
    </div>
  )
}
