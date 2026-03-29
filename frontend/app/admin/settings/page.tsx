'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSiteSettings, updateSiteSettings, type SiteSettingsMap } from '@/lib/services/site-settings'
import { toast } from 'sonner'

type SettingsForm = {
  logo: string
  siteName: string
  description: string
  email: string
  phone: string
  address: string
  facebook: string
  instagram: string
  linkedin: string
  zalo: string
}

function buildForm(settings: SiteSettingsMap): SettingsForm {
  const socialLinks = (settings.socialLinks as Record<string, string> | undefined) ?? {}

  return {
    logo: String(settings.logo ?? ''),
    siteName: String(settings.siteName ?? ''),
    description: String(settings.description ?? ''),
    email: String(settings.email ?? ''),
    phone: String(settings.phone ?? ''),
    address: String(settings.address ?? ''),
    facebook: socialLinks.facebook ?? '',
    instagram: socialLinks.instagram ?? '',
    linkedin: socialLinks.linkedin ?? '',
    zalo: socialLinks.zalo ?? '',
  }
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(buildForm({}))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSiteSettings()
      .then((response) => setForm(buildForm(response.data ?? {})))
      .catch((err) => setError(err instanceof Error ? err.message : 'Khong the tai site settings'))
      .finally(() => setIsLoading(false))
  }, [])

  const saveSettings = async () => {
    try {
      await updateSiteSettings({
        logo: form.logo,
        siteName: form.siteName,
        description: form.description,
        email: form.email,
        phone: form.phone,
        address: form.address,
        socialLinks: {
          facebook: form.facebook,
          instagram: form.instagram,
          linkedin: form.linkedin,
          zalo: form.zalo,
        },
      })
      toast.success('Da luu site settings')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu settings')
    }
  }

  const updateField = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Thong tin website dang duoc doc va ghi tu bang site_setting</p>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Thong tin website</h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="logo">Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-gray-50">
                {form.logo ? <Image src={form.logo} alt="Logo" fill className="object-contain" /> : null}
              </div>
              <Input id="logo" value={form.logo} onChange={(event) => updateField('logo', event.target.value)} />
            </div>
          </div>
          {(['siteName', 'email', 'phone', 'address'] as Array<keyof SettingsForm>).map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field}</Label>
              <Input id={field} value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-2" />
            </div>
          ))}
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Social links</h2>
        <div className="space-y-4">
          {(['facebook', 'instagram', 'linkedin', 'zalo'] as Array<keyof SettingsForm>).map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field}</Label>
              <Input id={field} value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-2" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 text-sm text-gray-600">
        {isLoading
          ? 'Dang tai site settings tu backend.'
          : 'Workflow doi mat khau va permission granularity sau role enum chua co API rieng, nen duoc giu trong backlog backend.'}
      </Card>

      <Button onClick={saveSettings} className="bg-brand-primary hover:bg-brand-secondary">
        <Save size={18} className="mr-2" />
        Luu settings
      </Button>
    </div>
  )
}
