import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { SkeletonBlock, SkeletonText } from './Skeleton'

export default function GoogleReviews() {
  const { t } = useI18n()
  type GReview = { author_name: string; rating: number; text: string; time: number; relative_time_description?: string; profile_photo_url?: string }
  const [data, setData] = useState<{ rating: number | null; total: number; reviews: GReview[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const r = await fetch(`${apiBase}/api/social/google/reviews`)
        const j = await r.json()
        if (!r.ok) throw new Error(j?.message || 'fail')
        if (!cancelled) setData(j)
      } catch {
        if (!cancelled) setError('fail')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [apiBase])

  if (error) {
    return <div className="text-sm text-gray-600 dark:text-gray-300">{t('reviews.google.na')}</div>
  }
  if (!data) {
    return (
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <SkeletonText lines={2} />
        </div>
        <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <SkeletonBlock className="h-20" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {t('reviews.google.title')} — {data.rating ?? '—'}★ ({data.total})
        </div>
        <a
          className="text-emerald-700 dark:text-emerald-400 text-sm hover:underline"
          href="https://www.google.com/maps"
          target="_blank"
          rel="noreferrer"
        >
          {t('reviews.google.view')}
        </a>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {data.reviews.map((rv, i) => (
          <div key={i} className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center gap-2">
              {rv.profile_photo_url ? <img src={rv.profile_photo_url} alt={rv.author_name} className="w-6 h-6 rounded-full" /> : null}
              <div className="text-sm font-medium">{rv.author_name}</div>
              <div className="text-xs text-gray-500">{rv.rating}★ • {rv.relative_time_description}</div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{rv.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
