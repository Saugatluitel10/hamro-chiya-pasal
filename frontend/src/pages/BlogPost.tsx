import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Meta from '../components/Meta'
import StructuredData from '../components/StructuredData'
import { useI18n } from '../i18n/I18nProvider'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkeletonBlock, SkeletonText } from '../components/Skeleton'
import { formatDateAuto } from '../utils/format'
import Lightbox from '../components/Lightbox'

type Post = {
  slug: string
  title: string
  excerpt: string
  content: string
  heroImage?: string
  publishedAt: string
  author?: string
  category?: string
}

export default function BlogPost() {
  const { t, locale } = useI18n()
  const { slug = '' } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { pathname } = useLocation()
  const url = `${origin}${pathname}`
  const [lb, setLb] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/blog/${slug}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load post')
        if (!cancelled) setPost(data.post as Post)
        // related
        const r = await fetch(`${apiBase}/api/blog/${slug}/related`)
        const rj = await r.json()
        if (r.ok && !cancelled) setRelated(Array.isArray(rj.related) ? rj.related : [])
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
  }, [apiBase, slug])

  const siteName = t('brand')

  const shareUrl = encodeURIComponent(url)
  const shareText = encodeURIComponent(post?.title || siteName)

  return (
    <>
      <Meta
        title={post ? `${post.title} • ${siteName}` : t('blog.title')}
        description={post?.excerpt || t('blog.desc')}
        url={url}
        image={post?.heroImage || `${origin}/og/og-default.svg`}
        locale={locale === 'ne' ? 'ne_NP' : 'en_US'}
        localizedUrlStrategy="prefix"
      />
      {post && (
        <StructuredData
          json={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            ...(post.heroImage ? { image: [post.heroImage] } : {}),
            datePublished: post.publishedAt,
            author: post.author || 'Hamro Chiya Pasal',
            mainEntityOfPage: url,
          }}
        />
      )}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { label: t('brand'), href: `/${locale}/` },
            { label: t('nav.blog'), href: `/${locale}/blog` },
            ...(post ? [{ label: post.title, href: `/${locale}/blog/${post.slug}` }] : []),
          ]}
        />
        {loading && (
          <article className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
            <SkeletonBlock className="w-full h-56 mb-4" />
            <SkeletonBlock className="h-8 w-2/3 mb-2" />
            <SkeletonText lines={3} />
            <SkeletonText lines={6} className="mt-4" />
          </article>
        )}
        {error && (
          <div className="text-sm rounded-md px-3 py-2 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">{error}</div>
        )}
        {!loading && post && (
          <article>
            {post.heroImage ? (
              <img
                src={post.heroImage}
                alt=""
                className="w-full h-56 object-cover rounded mb-4 cursor-zoom-in"
                loading="lazy"
                onClick={() => setLb(true)}
              />
            ) : null}
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <div className="text-xs text-gray-500 mt-1">
              <time dateTime={post.publishedAt}>{formatDateAuto(post.publishedAt, locale)}</time>
              {post.author ? <> • {post.author}</> : null}
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{post.excerpt}</p>

            {/* Render content (markdown as pre-wrap to avoid adding a new dep) */}
            <div className="prose dark:prose-invert max-w-none mt-4">
              <pre className="whitespace-pre-wrap">{post.content}</pre>
            </div>

            {/* Sharing */}
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span className="text-gray-600 dark:text-gray-300">{t('blog.share')}</span>
              <a className="text-emerald-700 dark:text-emerald-400 hover:underline" href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer">{t('blog.share.twitter')}</a>
              <a className="text-emerald-700 dark:text-emerald-400 hover:underline" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer">{t('blog.share.facebook')}</a>
              <a className="text-emerald-700 dark:text-emerald-400 hover:underline" href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer">{t('blog.share.whatsapp')}</a>
            </div>

            {/* Related posts */}
            {related.length > 0 ? (
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">{t('blog.related')}</h2>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.slug} className="rounded border border-gray-200 dark:border-gray-800 p-3">
                      <Link className="hover:underline" to={`/${locale}/blog/${r.slug}`}>{r.title}</Link>
                      <div className="text-xs text-gray-500">
                        <time dateTime={r.publishedAt}>{formatDateAuto(r.publishedAt, locale)}</time>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        )}
        {lb && post?.heroImage ? <Lightbox src={post.heroImage} alt={post.title} onClose={() => setLb(false)} /> : null}
      </main>
    </>
  )
}
