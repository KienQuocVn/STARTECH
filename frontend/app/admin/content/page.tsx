'use client'

import { useEffect, useMemo, useState } from 'react'
import { Edit2, FileText, HelpCircle, Plus } from 'lucide-react'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  approveAdminSitePage,
  createAdminSitePage,
  deleteAdminFaq,
  deleteAdminPageSection,
  deleteAdminSitePage,
  getAdminSiteContentAuditLogs,
  getAdminSitePages,
  publishAdminSitePage,
  requestChangesAdminSitePage,
  submitAdminSitePageForReview,
  updateAdminSitePage,
  upsertAdminFaq,
  upsertAdminPageSection,
  type SiteContentAuditLog,
  type SiteFaqItem,
  type SitePageContent,
  type SitePageSection,
} from '@/lib/services/site-content'
import { toast } from 'sonner'

type PageFormState = {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
}

type SectionFormState = {
  id?: number
  sectionKey: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  primaryButtonLabel: string
  primaryButtonHref: string
  secondaryButtonLabel: string
  secondaryButtonHref: string
  contentJson: string
  displayOrder: string
}

type FaqFormState = {
  id?: number
  question: string
  answer: string
  displayOrder: string
}

const sectionTemplates = {
  hero: {
    bullets: ['Gia tri 1', 'Gia tri 2', 'Gia tri 3'],
    mediaType: 'image',
    mediaUrl: '/img/website-design-team.png',
  },
  stats: {
    items: [
      { title: 'Chi so 1', value: '24/7', description: 'Mo ta ngan cho chi so 1' },
      { title: 'Chi so 2', value: '100%', description: 'Mo ta ngan cho chi so 2' },
      { title: 'Chi so 3', value: 'CMS', description: 'Mo ta ngan cho chi so 3' },
    ],
  },
  cards: {
    items: [
      { title: 'Card 1', description: 'Mo ta card 1', imageUrl: '/modern-corporate-website.png', href: '/lien-he' },
      { title: 'Card 2', description: 'Mo ta card 2', imageUrl: '/modern-ecommerce-website.png', href: '/du-an' },
    ],
  },
} as const

function buildPageForm(page?: SitePageContent | null): PageFormState {
  return {
    slug: page?.slug ?? '',
    title: page?.title ?? '',
    seoTitle: page?.seoTitle ?? '',
    seoDescription: page?.seoDescription ?? '',
    heroBadge: page?.heroBadge ?? '',
    heroTitle: page?.heroTitle ?? '',
    heroDescription: page?.heroDescription ?? '',
  }
}

function buildSectionForm(section?: SitePageSection | null): SectionFormState {
  return {
    id: section?.id,
    sectionKey: section?.sectionKey ?? '',
    title: section?.title ?? '',
    subtitle: section?.subtitle ?? '',
    description: section?.description ?? '',
    imageUrl: section?.imageUrl ?? '',
    primaryButtonLabel: section?.primaryButtonLabel ?? '',
    primaryButtonHref: section?.primaryButtonHref ?? '',
    secondaryButtonLabel: section?.secondaryButtonLabel ?? '',
    secondaryButtonHref: section?.secondaryButtonHref ?? '',
    contentJson: section?.contentJson ? JSON.stringify(section.contentJson, null, 2) : '',
    displayOrder: String(section?.displayOrder ?? 0),
  }
}

function buildFaqForm(faq?: SiteFaqItem | null): FaqFormState {
  return {
    id: faq?.id,
    question: faq?.question ?? '',
    answer: faq?.answer ?? '',
    displayOrder: String(faq?.displayOrder ?? 0),
  }
}

function formatWorkflowStatus(status?: SitePageContent['workflowStatus']) {
  switch (status) {
    case 'IN_REVIEW':
      return 'In review'
    case 'APPROVED':
      return 'Approved'
    case 'PUBLISHED':
      return 'Published'
    case 'CHANGES_REQUESTED':
      return 'Changes requested'
    default:
      return 'Draft'
  }
}

function formatFieldLabel(field: string) {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase())
}

export default function ContentPage() {
  const [pages, setPages] = useState<SitePageContent[]>([])
  const [auditLogs, setAuditLogs] = useState<SiteContentAuditLog[]>([])
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageOpen, setIsPageOpen] = useState(false)
  const [isSectionOpen, setIsSectionOpen] = useState(false)
  const [isFaqOpen, setIsFaqOpen] = useState(false)
  const [pageForm, setPageForm] = useState<PageFormState>(buildPageForm())
  const [sectionForm, setSectionForm] = useState<SectionFormState>(buildSectionForm())
  const [faqForm, setFaqForm] = useState<FaqFormState>(buildFaqForm())
  const [editingPage, setEditingPage] = useState<SitePageContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [workflowNotes, setWorkflowNotes] = useState('')

  const loadPages = async () => {
    const response = await getAdminSitePages()
    const nextPages = response.data ?? []
    setPages(nextPages)
    setSelectedPageId((current) => {
      if (current && nextPages.some((page) => page.id === current)) return current
      return nextPages[0]?.id ?? null
    })
  }

  const loadAuditLogs = async (pageId?: number | null) => {
    const response = await getAdminSiteContentAuditLogs(pageId ?? undefined)
    setAuditLogs(response.data ?? [])
  }

  useEffect(() => {
    let active = true

    loadPages()
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Khong the tai noi dung site')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? null,
    [pages, selectedPageId],
  )

  useEffect(() => {
    loadAuditLogs(selectedPageId).catch(() => setAuditLogs([]))
  }, [selectedPageId])

  const savePage = async () => {
    const payload = {
      ...pageForm,
      seoTitle: pageForm.seoTitle || null,
      seoDescription: pageForm.seoDescription || null,
      heroBadge: pageForm.heroBadge || null,
      heroTitle: pageForm.heroTitle || null,
      heroDescription: pageForm.heroDescription || null,
    }

    try {
      if (editingPage) {
        await updateAdminSitePage(editingPage.id, payload)
        toast.success('Da cap nhat page content')
      } else {
        await createAdminSitePage(payload)
        toast.success('Da tao page content')
      }

      await loadPages()
      await loadAuditLogs(editingPage?.id ?? selectedPageId)
      setIsPageOpen(false)
      setEditingPage(null)
      setPageForm(buildPageForm())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu page')
    }
  }

  const saveSection = async () => {
    if (!selectedPage) return

    try {
      const parsedContentJson = sectionForm.contentJson.trim() ? JSON.parse(sectionForm.contentJson) : null

      await upsertAdminPageSection(selectedPage.id, {
        ...sectionForm,
        title: sectionForm.title || null,
        subtitle: sectionForm.subtitle || null,
        description: sectionForm.description || null,
        imageUrl: sectionForm.imageUrl || null,
        primaryButtonLabel: sectionForm.primaryButtonLabel || null,
        primaryButtonHref: sectionForm.primaryButtonHref || null,
        secondaryButtonLabel: sectionForm.secondaryButtonLabel || null,
        secondaryButtonHref: sectionForm.secondaryButtonHref || null,
        contentJson: parsedContentJson,
        displayOrder: Number(sectionForm.displayOrder || 0),
      })
      await loadPages()
      await loadAuditLogs(selectedPage.id)
      setIsSectionOpen(false)
      setSectionForm(buildSectionForm())
      toast.success('Da luu section')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu section')
    }
  }

  const saveFaq = async () => {
    if (!selectedPage) return

    try {
      await upsertAdminFaq(selectedPage.id, {
        ...faqForm,
        displayOrder: Number(faqForm.displayOrder || 0),
      })
      await loadPages()
      await loadAuditLogs(selectedPage.id)
      setIsFaqOpen(false)
      setFaqForm(buildFaqForm())
      toast.success('Da luu FAQ')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu FAQ')
    }
  }

  const runWorkflowAction = async (action: () => Promise<unknown>, successMessage: string) => {
    try {
      await action()
      await loadPages()
      await loadAuditLogs(selectedPageId)
      setWorkflowNotes('')
      toast.success(successMessage)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the thuc hien workflow action')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            setEditingPage(null)
            setPageForm(buildPageForm())
            setIsPageOpen(true)
          }}
        >
          <Plus size={18} className="mr-2" />
          Them page
        </Button>
      </div>

      {error ? <Card className="status-danger-soft border-0 p-4 text-sm">{error}</Card> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-3">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              className={`admin-panel w-full rounded-2xl p-4 text-left transition-all ${
                page.id === selectedPageId ? 'admin-nav-active' : 'text-brand-strong'
              }`}
            >
              <p className="font-semibold">{page.title}</p>
              <p className="text-xs opacity-80">/{page.slug}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selectedPage ? (
            <div className="space-y-6">
              <Card className="admin-panel border-0 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-strong">{selectedPage.title}</h2>
                    <p className="text-sm text-brand-muted">/{selectedPage.slug}</p>
                    <div className="mt-3 inline-flex rounded-full bg-[var(--surface-accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                      {formatWorkflowStatus(selectedPage.workflowStatus)}
                    </div>
                    <p className="mt-3 text-sm text-brand-body">{selectedPage.seoDescription || 'Chua co mo ta SEO.'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPage(selectedPage)
                        setPageForm(buildPageForm(selectedPage))
                        setIsPageOpen(true)
                      }}
                      className="rounded p-1 text-brand-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <DeletePopover
                      onDelete={async () => {
                        await deleteAdminSitePage(selectedPage.id)
                        await loadPages()
                        await loadAuditLogs(null)
                        toast.success('Da xoa page')
                      }}
                      itemName={selectedPage.title}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <textarea
                    value={workflowNotes}
                    onChange={(event) => setWorkflowNotes(event.target.value)}
                    className="min-h-20 w-full rounded-xl border border-[var(--border-admin)] bg-[var(--surface-page)] px-3 py-2 text-sm text-brand-body"
                    placeholder="Workflow notes cho review, approve hoac publish"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => runWorkflowAction(() => submitAdminSitePageForReview(selectedPage.id, workflowNotes), 'Da gui page di review')}
                    >
                      Submit review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => runWorkflowAction(() => requestChangesAdminSitePage(selectedPage.id, workflowNotes), 'Da chuyen page ve changes requested')}
                    >
                      Request changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => runWorkflowAction(() => approveAdminSitePage(selectedPage.id, workflowNotes), 'Da approve page')}
                    >
                      Approve
                    </Button>
                    <Button onClick={() => runWorkflowAction(() => publishAdminSitePage(selectedPage.id, workflowNotes), 'Da publish page')}>
                      Publish live
                    </Button>
                  </div>
                </div>

                {selectedPage.versions?.length ? (
                  <div className="mt-4 rounded-xl bg-[var(--surface-subtle)] p-4 text-sm text-brand-body">
                    {selectedPage.versions.map((version) => (
                      <div key={version.id} className="flex items-center justify-between border-b border-[var(--border-subtle)] py-2 last:border-b-0">
                        <span>v{version.versionNumber}</span>
                        <span>{formatWorkflowStatus(version.workflowStatus)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>

              <Card className="admin-panel border-0 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-strong">Sections</h3>
                  <Button
                    onClick={() => {
                      setSectionForm(buildSectionForm())
                      setIsSectionOpen(true)
                    }}
                  >
                    <Plus size={16} className="mr-2" />
                    Them section
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedPage.sections.map((section) => (
                    <Card key={section.id} className="rounded-2xl border border-[var(--border-admin)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-brand-strong">{section.sectionKey}</p>
                          <p className="text-sm text-brand-body">{section.title || section.description || 'Section khong co noi dung mo ta.'}</p>
                          {section.contentJson ? <p className="mt-2 text-xs text-brand-muted">Co du lieu JSON cau truc</p> : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSectionForm(buildSectionForm(section))
                              setIsSectionOpen(true)
                            }}
                            className="rounded p-1 text-brand-primary transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <DeletePopover
                            onDelete={async () => {
                              await deleteAdminPageSection(section.id)
                              await loadPages()
                              await loadAuditLogs(selectedPage.id)
                              toast.success('Da xoa section')
                            }}
                            itemName={section.sectionKey}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {selectedPage.sections.length === 0 ? (
                    <EmptyState icon={<FileText size={40} />} title="Chua co section" description="Them section dau tien cho page nay." />
                  ) : null}
                </div>
              </Card>

              <Card className="admin-panel border-0 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-strong">FAQs</h3>
                  <Button
                    onClick={() => {
                      setFaqForm(buildFaqForm())
                      setIsFaqOpen(true)
                    }}
                  >
                    <Plus size={16} className="mr-2" />
                    Them FAQ
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedPage.faqs.map((faq) => (
                    <Card key={faq.id} className="rounded-2xl border border-[var(--border-admin)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-brand-strong">{faq.question}</p>
                          <p className="text-sm text-brand-body">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setFaqForm(buildFaqForm(faq))
                              setIsFaqOpen(true)
                            }}
                            className="rounded p-1 text-brand-primary transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <DeletePopover
                            onDelete={async () => {
                              await deleteAdminFaq(faq.id)
                              await loadPages()
                              await loadAuditLogs(selectedPage.id)
                              toast.success('Da xoa FAQ')
                            }}
                            itemName={faq.question}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {selectedPage.faqs.length === 0 ? (
                    <EmptyState icon={<HelpCircle size={40} />} title="Chua co FAQ" description="Them FAQ de bo sung schema va noi dung SEO." />
                  ) : null}
                </div>
              </Card>

              <Card className="admin-panel border-0 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-strong">Audit Trail</h3>
                  <span className="text-sm text-brand-muted">{auditLogs.length} su kien gan nhat</span>
                </div>
                <div className="space-y-3">
                  {auditLogs.map((log) => {
                    const metadata = (log.metadata ?? {}) as Record<string, unknown>
                    const actorEmail = typeof metadata.actorEmail === 'string' ? metadata.actorEmail : 'unknown'
                    const actorRole = typeof metadata.actorRole === 'string' ? metadata.actorRole : null
                    const pageId = typeof metadata.pageId === 'number' ? metadata.pageId : null

                    return (
                      <div key={log.id} className="rounded-2xl border border-[var(--border-admin)] bg-[var(--surface-page)] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-brand-strong">{log.action}</p>
                            <p className="text-sm text-brand-body">
                              {actorEmail}
                              {actorRole ? ` (${actorRole})` : ''}
                            </p>
                          </div>
                          <div className="text-right text-xs text-brand-muted">
                            <p>{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
                            <p>
                              {log.entityType}
                              {pageId ? ` • page ${pageId}` : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {auditLogs.length === 0 ? (
                    <EmptyState icon={<FileText size={40} />} title="Chua co audit log" description="Cac thay doi workflow va content se hien thi tai day." />
                  ) : null}
                </div>
              </Card>
            </div>
          ) : (
            <EmptyState
              icon={<FileText size={48} />}
              title={isLoading ? 'Dang tai page content' : 'Chua co page nao'}
              description={isLoading ? 'He thong dang tai du lieu tu backend.' : 'Hay tao page content dau tien.'}
            />
          )}
        </div>
      </div>

      <SlideOver isOpen={isPageOpen} onClose={() => setIsPageOpen(false)} title={editingPage ? 'Cap nhat page' : 'Them page'} size="md">
        <div className="space-y-4">
          {(['slug', 'title', 'seoTitle', 'heroBadge', 'heroTitle'] as Array<keyof PageFormState>).map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold text-brand-strong">{formatFieldLabel(field)}</label>
              <input
                value={pageForm[field]}
                onChange={(event) => setPageForm((prev) => ({ ...prev, [field]: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-brand-strong">Seo description</label>
            <textarea
              value={pageForm.seoDescription}
              onChange={(event) => setPageForm((prev) => ({ ...prev, seoDescription: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-strong">Hero description</label>
            <textarea
              value={pageForm.heroDescription}
              onChange={(event) => setPageForm((prev) => ({ ...prev, heroDescription: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
            />
          </div>
          <Button onClick={savePage} className="w-full">
            Luu page
          </Button>
        </div>
      </SlideOver>

      <SlideOver isOpen={isSectionOpen} onClose={() => setIsSectionOpen(false)} title={sectionForm.id ? 'Cap nhat section' : 'Them section'} size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-brand-strong">Template JSON</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setSectionForm((prev) => ({ ...prev, contentJson: JSON.stringify(sectionTemplates.hero, null, 2) }))}>
                Hero
              </Button>
              <Button type="button" variant="outline" onClick={() => setSectionForm((prev) => ({ ...prev, contentJson: JSON.stringify(sectionTemplates.stats, null, 2) }))}>
                Stats
              </Button>
              <Button type="button" variant="outline" onClick={() => setSectionForm((prev) => ({ ...prev, contentJson: JSON.stringify(sectionTemplates.cards, null, 2) }))}>
                Cards
              </Button>
            </div>
          </div>
          {(['sectionKey', 'title', 'subtitle', 'imageUrl', 'primaryButtonLabel', 'primaryButtonHref', 'secondaryButtonLabel', 'secondaryButtonHref', 'displayOrder'] as Array<keyof SectionFormState>).map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold text-brand-strong">{formatFieldLabel(field)}</label>
              <input
                value={String(sectionForm[field] ?? '')}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, [field]: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-brand-strong">Description</label>
            <textarea
              value={sectionForm.description}
              onChange={(event) => setSectionForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-strong">contentJson</label>
            <textarea
              value={sectionForm.contentJson}
              onChange={(event) => setSectionForm((prev) => ({ ...prev, contentJson: event.target.value }))}
              className="mt-2 min-h-40 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 font-mono text-xs text-brand-body"
              placeholder='{"items":[]}'
            />
          </div>
          <Button onClick={saveSection} className="w-full">
            Luu section
          </Button>
        </div>
      </SlideOver>

      <SlideOver isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} title={faqForm.id ? 'Cap nhat FAQ' : 'Them FAQ'} size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-brand-strong">Question</label>
            <input
              value={faqForm.question}
              onChange={(event) => setFaqForm((prev) => ({ ...prev, question: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-strong">Answer</label>
            <textarea
              value={faqForm.answer}
              onChange={(event) => setFaqForm((prev) => ({ ...prev, answer: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-strong">Display order</label>
            <input
              value={faqForm.displayOrder}
              onChange={(event) => setFaqForm((prev) => ({ ...prev, displayOrder: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-[var(--border-admin)] px-3 py-2 text-sm text-brand-body"
            />
          </div>
          <Button onClick={saveFaq} className="w-full">
            Luu FAQ
          </Button>
        </div>
      </SlideOver>
    </div>
  )
}
