'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu } from '@/components/menu'
import { getPublicSiteSettings } from '@/lib/services/site-settings'

type NavItem = { name: string; href: string }
type NavigationContent = {
  items?: NavItem[]
  ctaLabel?: string
  ctaHref?: string
}

export function Navbar(): JSX.Element {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [content, setContent] = useState<NavigationContent>({})

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    getPublicSiteSettings()
      .then((response) => {
        setContent((response.data?.public_navigation as NavigationContent) ?? {})
      })
      .catch(() => null)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const navItems = useMemo(() => content.items ?? [], [content.items])

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="navbar-left flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icon/logo.png" alt="STARTECH" width={160} height={50} className="object-contain transition-transform duration-300 hover:scale-105" priority />
            </Link>
            <div className="hidden h-6 w-px bg-gray-300 sm:block" />
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={`${item.name}-${item.href}`}
                  href={item.href}
                  className={`relative text-sm transition-colors hover:text-[#1a63a8] ${isActive ? 'font-medium text-[#1a63a8]' : 'text-gray-700'}`}
                >
                  {item.name}
                  {isActive ? <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1a63a8]" /> : null}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={content.ctaHref || '/lien-he'}
              aria-label="Liên hệ button"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] px-6 py-2.5 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:flex"
            >
              <span>{content.ctaLabel || 'Liên hệ'}</span>
            </Link>

            <div className="hidden h-6 w-px bg-gray-300 sm:block" />

            <button className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5" onClick={toggleMenu} aria-label="Toggle menu">
              <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${isMenuOpen ? '-translate-y-0.5 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
