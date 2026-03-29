'use client'

import { useEffect, useMemo, useState } from 'react'
import { Edit2, FileText, HelpCircle, Plus } from 'lucide-react'
import { DeletePopover } from '@/components/admin/DeletePopover'
import { EmptyState } from '@/components/admin/EmptyState'
import { SlideOver } from '@/components/admin/SlideOver'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  createAdminSitePage,
  deleteAdminFaq,
  deleteAdminPageSection,
  deleteAdminSitePage,
  getAdminSitePages,
  updateAdminSitePage,
  upsertAdminFaq,
  upsertAdminPageSection,
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
  displayOrder: string
}

type FaqFormState = {
  id?: number
  question: string
  answer: string
  displayOrder: string
}

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

export default function ContentPage() {
  const [pages, setPages] = useState<SitePageContent[]>([])
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

  const loadPages = async () => {
    const response = await getAdminSitePages()
    const nextPages = response.data ?? []
    setPages(nextPages)
    setSelectedPageId((current) => {
      if (current && nextPages.some((page) => page.id === current)) return current
      return nextPages[0]?.id ?? null
    })
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
        displayOrder: Number(sectionForm.displayOrder || 0),
      })
      await loadPages()
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
      setIsFaqOpen(false)
      setFaqForm(buildFaqForm())
      toast.success('Da luu FAQ')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khong the luu FAQ')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content</h1>
          <p className="mt-1 text-gray-600">Quan ly page, section va FAQ tu live API</p>
        </div>
        <Button
          onClick={() => {
            setEditingPage(null)
            setPageForm(buildPageForm())
            setIsPageOpen(true)
          }}
          className="bg-brand-primary hover:bg-brand-secondary"
        >
          <Plus size={18} className="mr-2" />
          Them page
        </Button>
      </div>

      {error ? <Card className="p-4 text-sm text-red-600">{error}</Card> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-3">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              className={`w-full rounded-lg p-4 text-left transition-all ${
                page.id === selectedPageId ? 'bg-brand-primary text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
              }`}
            >
              <p className="font-semibold">{page.title}</p>
              <p className={`text-xs ${page.id === selectedPageId ? 'text-blue-100' : 'text-gray-500'}`}>/{page.slug}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selectedPage ? (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPage.title}</h2>
                    <p className="text-sm text-gray-500">/{selectedPage.slug}</p>
                    <p className="mt-3 text-sm text-gray-600">{selectedPage.seoDescription || 'Chua co mo ta SEO.'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPage(selectedPage)
                        setPageForm(buildPageForm(selectedPage))
                        setIsPageOpen(true)
                      }}
                      className="rounded p-1 text-brand-primary transition-colors hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <DeletePopover
                      onDelete={async () => {
                        await deleteAdminSitePage(selectedPage.id)
                        await loadPages()
                        toast.success('Da xoa page')
                      }}
                      itemName={selectedPage.title}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
                  <Button
                    onClick={() => {
                      setSectionForm(buildSectionForm())
                      setIsSectionOpen(true)
                    }}
                    className="bg-brand-primary hover:bg-brand-secondary"
                  >
                    <Plus size={16} className="mr-2" />
                    Them section
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedPage.sections.map((section) => (
                    <Card key={section.id} className="border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{section.sectionKey}</p>
                          <p className="text-sm text-gray-600">{section.title || section.description || 'Section khong co noi dung mo ta.'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSectionForm(buildSectionForm(section))
                              setIsSectionOpen(true)
                            }}
                            className="rounded p-1 text-brand-primary transition-colors hover:bg-blue-50"
                          >
                            <Edit2 size={16} />
                          </button>
                          <DeletePopover
                            onDelete={async () => {
                              await deleteAdminPageSection(section.id)
                              await loadPages()
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

              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
                  <Button
                    onClick={() => {
                      setFaqForm(buildFaqForm())
                      setIsFaqOpen(true)
                    }}
                    className="bg-brand-primary hover:bg-brand-secondary"
                  >
                    <Plus size={16} className="mr-2" />
                    Them FAQ
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedPage.faqs.map((faq) => (
                    <Card key={faq.id} className="border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{faq.question}</p>
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setFaqForm(buildFaqForm(faq))
                              setIsFaqOpen(true)
                            }}
                            className="rounded p-1 text-brand-primary transition-colors hover:bg-blue-50"
                          >
                            <Edit2 size={16} />
                          </button>
                          <DeletePopover
                            onDelete={async () => {
                              await deleteAdminFaq(faq.id)
                              await loadPages()
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
            </div>
          ) : (
            <EmptyState
              icon={<FileText size={48} />}
              title={isLoading ? 'Dang tai page content' : 'Chua co page nao'}
              description={isLoading ? 'He thong dang lay du lieu tu backend.' : 'Hay tao page content dau tien.'}
            />
          )}
        </div>
      </div>

      <SlideOver isOpen={isPageOpen} onClose={() => setIsPageOpen(false)} title={editingPage ? 'Cap nhat page' : 'Them page'} size="md">
        <div className="space-y-4">
          {(['slug', 'title', 'seoTitle', 'heroBadge', 'heroTitle'] as Array<keyof PageFormState>).map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold capitalize text-gray-900">{field}</label>
              <input
                value={pageForm[field]}
                onChange={(event) => setPageForm((prev) => ({ ...prev, [field]: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-900">seoDescription</label>
            <textarea
              value={pageForm.seoDescription}
              onChange={(event) => setPageForm((prev) => ({ ...prev, seoDescription: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900">heroDescription</label>
            <textarea
              value={pageForm.heroDescription}
              onChange={(event) => setPageForm((prev) => ({ ...prev, heroDescription: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={savePage} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu page
          </Button>
        </div>
      </SlideOver>

      <SlideOver isOpen={isSectionOpen} onClose={() => setIsSectionOpen(false)} title={sectionForm.id ? 'Cap nhat section' : 'Them section'} size="md">
        <div className="space-y-4">
          {(['sectionKey', 'title', 'subtitle', 'imageUrl', 'primaryButtonLabel', 'primaryButtonHref', 'secondaryButtonLabel', 'secondaryButtonHref', 'displayOrder'] as Array<keyof SectionFormState>).map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold capitalize text-gray-900">{field}</label>
              <input
                value={String(sectionForm[field] ?? '')}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, [field]: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-900">description</label>
            <textarea
              value={sectionForm.description}
              onChange={(event) => setSectionForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={saveSection} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu section
          </Button>
        </div>
      </SlideOver>

      <SlideOver isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} title={faqForm.id ? 'Cap nhat FAQ' : 'Them FAQ'} size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-900">Question</label>
            <input
              value={faqForm.question}
              onChange={(event) => setFaqForm((prev) => ({ ...prev, question: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900">Answer</label>
            <textarea
              value={faqForm.answer}
              onChange={(event) => setFaqForm((prev) => ({ ...prev, answer: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900">Display order</label>
            <input
              value={faqForm.displayOrder}
              onChange={(event) => setFaqForm((prev) => ({ ...prev, displayOrder: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={saveFaq} className="w-full bg-brand-primary hover:bg-brand-secondary">
            Luu FAQ
          </Button>
        </div>
      </SlideOver>
    </div>
  )
}
