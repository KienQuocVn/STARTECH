'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Facebook, Instagram, Youtube } from 'lucide-react'
import { toast } from 'sonner'
import { createContact } from '@/lib/services/contact'
import { getPublicSiteSettings } from '@/lib/services/site-settings'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

type FooterLink = { name: string; href: string }
type SocialLink = { name: string; href: string }
type FooterContent = {
  companyDescription?: string
  officeInfo?: string[]
  services?: FooterLink[]
  socialLinks?: SocialLink[]
  copyright?: string
}
type ContactFormContent = {
  introText?: string
  services?: string[]
  submitLabel?: string
  successMessage?: string
}

function TikTokIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5 0V9.1C5.5 9.83454 4.90192 10.4 4.125 10.4C3.34808 10.4 2.75 9.83454 2.75 9.1C2.75 8.36546 3.34808 7.8 4.125 7.8V5.2C1.86317 5.2 0 6.96154 0 9.1C0 11.2385 1.86317 13 4.125 13C6.38683 13 8.25 11.2385 8.25 9.1V4.20215C9.0972 4.77274 9.98129 5.2 11 5.2V2.6C10.9349 2.6 9.98618 2.31522 9.32422 1.76973C8.66226 1.22423 8.25 0.539488 8.25 0H5.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function getSocialIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-4 w-4" />
    case 'youtube':
      return <Youtube className="h-4 w-4" />
    case 'instagram':
      return <Instagram className="h-4 w-4" />
    case 'tiktok':
      return <TikTokIcon />
    default:
      return null
  }
}

function CollapsibleSection({
  id,
  title,
  children,
}: {
  id: number
  title: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-slate-200 py-4 text-left text-sm font-semibold text-slate-900 lg:pointer-events-none lg:border-none lg:py-0"
        aria-expanded={isOpen}
        aria-controls={`footer-section-${id}`}
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform lg:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`footer-section-${id}`}
        className={`overflow-hidden transition-all duration-300 lg:mt-4 lg:block ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}
      >
        <div className="pb-4 pt-3 lg:pb-0 lg:pt-0">{children}</div>
      </div>
    </div>
  )
}

export function Footer() {
  const [footerContent, setFooterContent] = useState<FooterContent>({})
  const [contactContent, setContactContent] = useState<ContactFormContent>({})
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    getPublicSiteSettings()
      .then((response) => {
        if (!active) return
        setFooterContent((response.data?.public_footer as FooterContent) ?? {})
        setContactContent((response.data?.public_contact_form as ContactFormContent) ?? {})
      })
      .catch(() => null)

    return () => {
      active = false
    }
  }, [])

  const serviceOptions = useMemo(() => contactContent.services ?? [], [contactContent.services])
  const socialLinks = useMemo(() => footerContent.socialLinks ?? [], [footerContent.socialLinks])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (isSubmitting) return

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }

    setIsSubmitting(true)

    try {
      await createContact({
        ...formData,
        service: formData.service || 'Chưa chọn',
      })

      toast.success(contactContent.successMessage || 'Cảm ơn bạn đã liên hệ. STARTECH sẽ phản hồi trong thời gian sớm nhất.')
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      })
    } catch {
      toast.error('Đã xảy ra lỗi khi gửi biểu mẫu. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <Image src="/icon/logo.png" alt="STARTECH" width={180} height={56} className="object-contain" />
              <p className="mt-4 text-sm leading-7 text-slate-600">{footerContent.companyDescription || ''}</p>
            </div>

            <CollapsibleSection id={1} title="Trụ sở chính">
              <div className="space-y-2 text-sm leading-7 text-slate-600">
                {(footerContent.officeInfo ?? []).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection id={2} title="Dịch vụ">
              <div className="space-y-2">
                {(footerContent.services ?? []).map((service) => (
                  <Link key={`${service.name}-${service.href}`} href={service.href} className="block text-sm text-slate-600 transition-colors hover:text-[#1a63a8]">
                    {service.name}
                  </Link>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-950">Nhận tư vấn nhanh</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {contactContent.introText || 'Để lại thông tin, STARTECH sẽ liên hệ tư vấn giải pháp phù hợp cho doanh nghiệp của bạn.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <Input placeholder="Họ và tên" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required />
              <Input placeholder="Công ty" value={formData.company} onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))} />
              <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} required />
              <Input type="tel" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} required />
              <Select value={formData.service} onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Nội dung tin nhắn" value={formData.message} onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))} rows={4} />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8]">
                {isSubmitting ? 'Đang gửi...' : contactContent.submitLabel || 'Gửi yêu cầu'}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p>{footerContent.copyright || '© STARTECH. All rights reserved.'}</p>
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={`${item.name}-${item.href}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-[#1a63a8] hover:text-white"
                aria-label={item.name}
              >
                {getSocialIcon(item.name)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
