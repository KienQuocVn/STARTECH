import assert from 'node:assert/strict'
import { buildRobotsConfig, buildSitemapEntries } from '../lib/metadata-routes.ts'
import { absoluteUrl, buildMetadataFromPageContent, getSiteUrl } from '../lib/seo.ts'

function runTest(name, fn) {
  try {
    fn()
    console.log(`PASS ${name}`)
  } catch (error) {
    console.error(`FAIL ${name}`)
    throw error
  }
}

runTest('getSiteUrl trims trailing slash', () => {
  assert.equal(getSiteUrl().endsWith('/'), false)
})

runTest('absoluteUrl builds canonical url', () => {
  assert.equal(absoluteUrl('/du-an/demo'), `${getSiteUrl()}/du-an/demo`)
})

runTest('buildMetadataFromPageContent prefers page seo fields', () => {
  const metadata = buildMetadataFromPageContent(
    {
      id: 1,
      slug: 'home',
      title: 'Home',
      seoTitle: 'SEO Home',
      seoDescription: 'SEO Description',
      sections: [],
      faqs: [],
    },
    {
      title: 'Fallback Title',
      description: 'Fallback Description',
    },
    { pathname: '/trang-chu' },
  )

  assert.equal(metadata.title, 'SEO Home')
  assert.equal(metadata.description, 'SEO Description')
  assert.equal(metadata.alternates?.canonical, `${getSiteUrl()}/trang-chu`)
})

runTest('buildRobotsConfig points to canonical host and sitemap', () => {
  const robots = buildRobotsConfig()

  assert.equal(robots.host, getSiteUrl())
  assert.equal(robots.sitemap, `${getSiteUrl()}/sitemap.xml`)
})

runTest('buildSitemapEntries includes static routes and project slugs', () => {
  const sitemap = buildSitemapEntries([
    {
      slug: 'du-an-mau',
      updatedAt: '2026-03-29T00:00:00.000Z',
    },
  ])

  assert.ok(sitemap.some((entry) => entry.url === `${getSiteUrl()}/trang-chu`))
  assert.ok(sitemap.some((entry) => entry.url === `${getSiteUrl()}/du-an/du-an-mau`))
})
