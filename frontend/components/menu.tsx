'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Facebook, Instagram, X, Youtube } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getPublicSiteSettings } from '@/lib/services/site-settings'

type NavItem = { name: string; href: string }
type SocialLink = { name: string; href: string }
type NavigationContent = {
  items?: NavItem[]
  socialLinks?: SocialLink[]
  ctaLabel?: string
  ctaHref?: string
  promoLabel?: string
  promoTitle?: string
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
      return <Facebook className="h-5 w-5" />
    case 'youtube':
      return <Youtube className="h-5 w-5" />
    case 'instagram':
      return <Instagram className="h-5 w-5" />
    case 'tiktok':
      return <TikTokIcon />
    default:
      return null
  }
}

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const pathname = usePathname()
  const [content, setContent] = useState<NavigationContent>({})

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    getPublicSiteSettings()
      .then((response) => {
        setContent((response.data?.public_navigation as NavigationContent) ?? {})
      })
      .catch(() => null)
  }, [])

  const navItems = useMemo(() => content.items ?? [], [content.items])
  const socialLinks = useMemo(() => content.socialLinks ?? [], [content.socialLinks])

  return (
    <div className={`fixed inset-0 z-50 bg-white transition-all duration-500 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#1BC1C1]/10 to-transparent blur-3xl" />
      <div className="absolute bottom-20 left-16 h-72 w-72 rounded-full bg-gradient-to-br from-[#70efd1]/10 to-transparent blur-3xl" />

      <div className="relative flex h-full items-center justify-center overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:py-12">
          <button className="absolute right-6 top-8 flex h-10 w-10 items-center justify-center" onClick={onClose} aria-label="Đóng menu">
            <X className="h-6 w-6 text-gray-900" />
          </button>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className={`hidden space-y-6 lg:block ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#1BC1C1]" />
                <span className="text-sm font-medium text-gray-600">{content.promoLabel || 'Kết nối với chúng tôi'}</span>
              </div>

              <div className="text-3xl font-medium leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {content.promoTitle || 'STARTECH đồng hành cùng doanh nghiệp trên hành trình phát triển hiện diện số.'}
              </div>

              <Link href={content.ctaHref || '/lien-he'} onClick={onClose} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] px-8 py-4 text-white">
                <span className="uppercase tracking-wide">{content.ctaLabel || 'Liên hệ ngay'}</span>
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            <div className={`${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <ul className="flex flex-col items-center space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <li key={`${item.name}-${item.href}`} style={{ transitionDelay: `${300 + index * 50}ms` }}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center gap-4 rounded-xl px-6 py-4 transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-[#1BC1C1]/10 to-transparent' : 'hover:bg-gray-50'}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#1BC1C1]' : 'bg-gray-300 group-hover:bg-[#1BC1C1]'}`} />
                        <span className={`text-2xl font-medium sm:text-3xl ${isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className={`mt-12 lg:hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href={content.ctaHref || '/lien-he'} onClick={onClose} className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] px-8 py-4 text-white">
              <span>{content.ctaLabel || 'Liên hệ'}</span>
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>

          <div className={`mt-12 lg:mt-20 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <div className="flex flex-wrap items-center justify-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={`${social.name}-${social.href}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#1BC1C1] hover:to-[#70efd1] hover:text-white"
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
