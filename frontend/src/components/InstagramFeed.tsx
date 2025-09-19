import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { SkeletonBlock } from './Skeleton'

export type InstagramItem = {
  id: string
  media_url: string
  permalink: string
  caption?: string
  timestamp?: string
}

export default function InstagramFeed({ limit = 8 }: { limit?: number }) {
  const { t } = useI18n()
  const [items, setItems] = useState<InstagramItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/social/instagram?limit=${limit}`, { headers: { 'Accept': 'application/json' } })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!cancelled) setItems(Array.isArray(data) ? data : data?.data || [])
      } catch {
        if (!cancelled) setError('fail')
      }
    }
    load()
    return () => { cancelled = true }
  }, [apiBase, limit])

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('instagram.fallback')}</div>
        <a href="https://www.instagram.com/hamro.chiya.pasal" target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 hover:underline">{t('instagram.viewOn')}</a>
      </div>
    )
  }
  if (!items) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: limit }).map((_, i) => (
          <SkeletonBlock key={i} className="h-28" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.slice(0, limit).map((it) => (
        <a key={it.id} href={it.permalink} target="_blank" rel="noreferrer" className="group relative block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <img src={it.media_url} alt={it.caption || ''} className="h-28 w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white rounded px-1">Instagram</span>
        </a>
      ))}
    </div>
  )
}
