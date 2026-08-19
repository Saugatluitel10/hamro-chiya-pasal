import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Meta from '../components/Meta'
import StructuredData from '../components/StructuredData'
import { useI18n } from '../i18n/I18nProvider'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkeletonBlock, SkeletonText } from '../components/Skeleton'
import { formatDateAuto } from '../utils/format'

export type Post = {
  slug: string
  title: string
  excerpt: string
  heroImage?: string
  publishedAt: string
  author?: string
  category?: string
}

export default function BlogList() {
  const { t, locale } = useI18n()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 5
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const url = `${origin}${pathname}${search}`

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/blog?page=${page}&limit=${LIMIT}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load posts')
        if (!cancelled) {
          setPosts(Array.isArray(data.posts) ? data.posts : [])
          if (typeof data.page === 'number') setPage(data.page)
          if (typeof data.totalPages === 'number') setTotalPages(data.totalPages)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [apiBase, page])

  // Keep page in sync with ?page= in the URL
  useEffect(() => {
    const sp = new URLSearchParams(search)
    const q = parseInt(sp.get('page') || '1', 10)
    const target = Number.isFinite(q) && q > 0 ? q : 1
    if (target !== page) setPage(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    const sp = new URLSearchParams(search)
    const current = parseInt(sp.get('page') || '1', 10)
    if (current !== page) {
      sp.set('page', String(page))
      navigate({ pathname, search: `?${sp.toString()}` }, { replace: true })
    }
  }, [page, navigate, pathname, search])

  const siteName = t('brand')

  return (
    <>
      <Meta
        title={t('blog.title')}
        description={t('blog.desc')}
        url={url}
        image={`${origin}/og/og-default.svg`}
        locale={locale === 'ne' ? 'ne_NP' : 'en_US'}
        localizedUrlStrategy="prefix"
      />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: siteName,
          url,
        }}
      />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <header className="mb-6">
          <Breadcrumbs
            items={[
              { label: t('brand'), href: `/${locale}/` },
              { label: t('nav.blog'), href: `/${locale}/blog` },
            ]}
          />
          <h1 className="text-3xl font-bold tracking-tight">{t('blog.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t('blog.subtitle')}</p>
          <a href={`${apiBase}/api/blog/rss`} className="text-sm text-[--color-primary] dark:text-[--color-accent] hover:underline">{t('blog.rss')}</a>
        </header>

        {loading && (
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
                <SkeletonBlock className="w-full h-44 mb-3" />
                <SkeletonBlock className="h-6 w-1/2 mb-2" />
                <SkeletonText lines={3} />
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-sm text-rose-600">{error}</p>}

        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <article>
                {p.heroImage ? (
                  <img src={p.heroImage} alt="" className="w-full h-44 object-cover rounded mb-3" loading="lazy" />
                ) : null}
                <h2 className="text-xl font-semibold">
                  <Link to={`/${locale}/blog/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{p.excerpt}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <time dateTime={p.publishedAt}>{formatDateAuto(p.publishedAt, locale)}</time>
                  {p.author ? <> • {p.author}</> : null}
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 disabled:opacity-50"
            >
              ← Prev
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Page {page} of {totalPages}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 disabled:opacity-50"
            >
              Next →
            </button>
          </nav>
        )}
      </main>
    </>
  )
}
