import { useEffect, useState } from 'react'
import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'
import { apiGet } from '../utils/api'

export default function AdminSocial() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  // API base handled by api helper; no direct env needed here

  const [adminKey, setAdminKey] = useState<string>(() => localStorage.getItem('ADMIN_KEY') || '')
  type Metrics = { googleReviews?: { rating: number; count: number }; instagramFollowers?: number; ugcCount?: number }
  type UGCItem = { name?: string; handle?: string; postUrl?: string; submittedAt: number }
  type UGCList = { items: UGCItem[] }
  type RefAgg = { key: string; count: number }
  type RefStats = { referrers: RefAgg[]; sources: RefAgg[]; campaigns: RefAgg[] }
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [ugc, setUgc] = useState<UGCItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refstats, setRefstats] = useState<{ referrers: {key:string,count:number}[]; sources:{key:string,count:number}[]; campaigns:{key:string,count:number}[] } | null>(null)

  const headers = adminKey ? { 'x-admin-key': adminKey } : undefined

  async function loadAll() {
    setError(null)
    try {
      const [m, u, r] = await Promise.all([
        apiGet<Metrics>('/api/social/metrics', { headers }),
        apiGet<UGCList>('/api/social/ugc', { headers }),
        apiGet<RefStats>('/api/social/refstats', { headers }),
      ])
      setMetrics(m)
      setUgc(Array.isArray(u?.items) ? u.items : [])
      setRefstats(r)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    if (adminKey) loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey])

  return (
    <>
      <Meta title={t('admin.social.title')} description={t('admin.social.title')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">{t('admin.social.title')}</h1>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
            <label className="text-sm w-full sm:w-auto">
              <div className="text-gray-600 dark:text-gray-300">{t('admin.social.enterKey')}</div>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800 w-full"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { localStorage.setItem('ADMIN_KEY', adminKey); loadAll() }}
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700"
              >
                {t('admin.social.saveKey')}
              </button>
              <button
                type="button"
                onClick={() => { localStorage.removeItem('ADMIN_KEY'); setAdminKey(''); setMetrics(null); setUgc(null) }}
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm"
              >
                {t('admin.social.clearKey')}
              </button>
            </div>
          </div>
          {error ? <div className="mt-2 text-sm text-rose-600">{error}</div> : null}
        </div>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2">{t('admin.social.metrics')}</h2>
            {!metrics ? (
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.loading')}</div>
            ) : (
              <ul className="text-sm space-y-1">
                <li>Google: {metrics.googleReviews?.rating}★ ({metrics.googleReviews?.count})</li>
                <li>Instagram followers: {metrics.instagramFollowers}</li>
                <li>UGC submissions: {metrics.ugcCount}</li>
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2">{t('admin.social.ugc')}</h2>
            {!ugc ? (
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.loading')}</div>
            ) : ugc.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('admin.social.empty')}</div>
            ) : (
              <div className="max-h-72 overflow-auto text-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                      <th className="py-1 pr-2">Name</th>
                      <th className="py-1 pr-2">Handle</th>
                      <th className="py-1 pr-2">Post</th>
                      <th className="py-1 pr-2">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ugc.map((u) => (
                      <tr key={u.submittedAt} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2">{u.name || '—'}</td>
                        <td className="py-1 pr-2">{u.handle || '—'}</td>
                        <td className="py-1 pr-2">{u.postUrl ? <a href={u.postUrl} target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 hover:underline">link</a> : '—'}</td>
                        <td className="py-1 pr-2">{new Date(u.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-2">{t('admin.social.refstats')}</h2>
          {!refstats ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.loading')}</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              {([
                ['Referrers', refstats.referrers],
                ['Sources', refstats.sources],
                ['Campaigns', refstats.campaigns],
              ] as const).map(([label, list]) => (
                <div key={label} className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
                  <div className="font-medium mb-1">{label}</div>
                  {list.length === 0 ? (
                    <div className="text-gray-600 dark:text-gray-300">—</div>
                  ) : (
                    <ul className="space-y-1">
                      {list.map((it) => (
                        <li key={it.key} className="flex justify-between">
                          <span className="truncate mr-2" title={it.key}>{it.key}</span>
                          <span>{it.count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
