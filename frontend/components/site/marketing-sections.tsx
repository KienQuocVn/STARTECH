'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { MarketingHero, MarketingItem } from '@/lib/content/marketing-pages'
import { sanitizePlainText, sanitizeRichText } from '@/lib/sanitize'
import type { SiteFaqItem } from '@/lib/services/site-content'
import LaptopComponent from '@/components/3DModel/LaptopComponent'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

function TextBlock({ subtitle, title, description }: { subtitle?: string; title?: string; description?: string }) {
  const safeSubtitle = sanitizePlainText(subtitle)
  const safeTitle = sanitizePlainText(title)
  const safeDescription = sanitizePlainText(description)

  return (
    <div className="mx-auto max-w-3xl text-center">
      {safeSubtitle ? <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">{safeSubtitle}</p> : null}
      {safeTitle ? <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-strong)] sm:text-4xl">{safeTitle}</h2> : null}
      {safeDescription ? <p className="mt-4 text-base leading-8 text-[var(--text-body)]">{safeDescription}</p> : null}
    </div>
  )
}

export function MarketingHeroSection({ hero }: { hero: MarketingHero }) {
  const title = sanitizePlainText(hero.title)
  const description = sanitizePlainText(hero.description)
  const badge = sanitizePlainText(hero.badge)

  return (
    <section className="section-shell-muted overflow-hidden">
      <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          {badge ? (
            <div className="inline-flex rounded-full border border-[var(--border-strong)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-primary)]">
              {badge}
            </div>
          ) : null}
          <h1 className="mt-5 text-4xl font-bold leading-tight text-[var(--text-strong)] sm:text-5xl lg:text-6xl">{title}</h1>
          {description ? <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">{description}</p> : null}
          {hero.bullets.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {hero.bullets.map((bullet) => (
                <span key={bullet} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--text-strong)] shadow-sm">
                  {sanitizePlainText(bullet)}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-4">
            {hero.primaryCtaLabel && hero.primaryCtaHref ? (
              <Link href={hero.primaryCtaHref} className="inline-flex items-center rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                {sanitizePlainText(hero.primaryCtaLabel)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : null}
            {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
              <Link href={hero.secondaryCtaHref} className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-primary)]">
                {sanitizePlainText(hero.secondaryCtaLabel)}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="panel-elevated relative overflow-hidden rounded-[2rem] bg-white p-4">
          {hero.mediaType === '3d' ? (
            <div className="relative h-[320px] sm:h-[420px]">
              <LaptopComponent />
            </div>
          ) : hero.mediaUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <Image src={hero.mediaUrl} alt={hero.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function MarketingStatsSection({ items }: { items: MarketingItem[] }) {
  if (!items.length) return null

  return (
    <section className="section-shell">
      <div className="container mx-auto grid gap-5 px-4 sm:px-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={`${item.title}-${item.value}`} className="panel-elevated rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">{sanitizePlainText(item.title)}</p>
            {item.value ? <p className="mt-3 text-3xl font-bold text-[var(--brand-primary)]">{sanitizePlainText(item.value)}</p> : null}
            {item.description ? <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">{sanitizePlainText(item.description)}</p> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export function MarketingCardsSection({
  intro,
  items,
  variant = 'features',
}: {
  intro?: { title: string; subtitle?: string; description?: string }
  items: MarketingItem[]
  variant?: 'features' | 'showcase'
}) {
  if (!items.length) return null

  return (
    <section className={variant === 'showcase' ? 'section-shell-muted' : 'section-shell'}>
      <div className="container mx-auto px-4 sm:px-6">
        <TextBlock subtitle={intro?.subtitle} title={intro?.title} description={intro?.description} />
        <div className={`mt-10 grid gap-6 ${variant === 'showcase' ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-4'}`}>
          {items.map((item) => (
            <div key={`${item.title}-${item.imageUrl ?? item.description ?? ''}`} className="panel-elevated overflow-hidden rounded-[1.75rem]">
              {item.imageUrl ? (
                <div className="relative aspect-[4/3]">
                  <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 30vw" className="object-cover" />
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--text-strong)]">{sanitizePlainText(item.title)}</h3>
                {item.description ? <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">{sanitizePlainText(item.description)}</p> : null}
                {item.href ? <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-[var(--brand-primary)]">Xem them</Link> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MarketingProcessSection({
  intro,
  items,
}: {
  intro?: { title: string; subtitle?: string; description?: string }
  items: MarketingItem[]
}) {
  if (!items.length) return null

  return (
    <section className="section-shell">
      <div className="container mx-auto px-4 sm:px-6">
        <TextBlock subtitle={intro?.subtitle} title={intro?.title} description={intro?.description} />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="panel-elevated rounded-[1.75rem] p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Buoc {index + 1}</div>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--text-strong)]">{sanitizePlainText(item.title)}</h3>
              {item.description ? <p className="mt-4 text-sm leading-7 text-[var(--text-body)]">{sanitizePlainText(item.description)}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MarketingCtaSection({
  cta,
}: {
  cta?: { title: string; description?: string; primaryCtaLabel?: string; primaryCtaHref?: string }
}) {
  if (!cta?.title) return null

  return (
    <section className="section-shell-muted">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="panel-elevated rounded-[2rem] px-6 py-10 text-center sm:px-10">
          <h2 className="text-3xl font-bold leading-tight text-[var(--text-strong)] sm:text-4xl">{sanitizePlainText(cta.title)}</h2>
          {cta.description ? <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--text-body)]">{sanitizePlainText(cta.description)}</p> : null}
          {cta.primaryCtaLabel && cta.primaryCtaHref ? (
            <Link href={cta.primaryCtaHref} className="mt-8 inline-flex items-center rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white">
              {sanitizePlainText(cta.primaryCtaLabel)}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function MarketingFaqSection({ items }: { items: SiteFaqItem[] }) {
  if (!items.length) return null

  return (
    <section className="section-shell">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <TextBlock subtitle="FAQ" title="Giai dap nhung cau hoi thuong gap" description="Noi dung FAQ da duoc sanitize truoc khi render de an toan hon cho luong CMS/admin." />
        <Accordion type="single" collapsible className="mt-10 space-y-4">
          {items.map((faq) => (
            <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="panel-elevated rounded-[1.5rem] border-none px-2">
              <AccordionTrigger className="px-4 text-left text-base font-semibold text-[var(--text-strong)]">{sanitizePlainText(faq.question)}</AccordionTrigger>
              <AccordionContent className="px-4 pb-5 text-sm leading-7 text-[var(--text-body)] whitespace-pre-line">
                {sanitizeRichText(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
