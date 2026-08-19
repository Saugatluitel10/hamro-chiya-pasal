import { useEffect, useMemo, useState } from 'react'
import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import OrderShareCTA, { type OrderItem } from '../components/OrderShareCTA'
import { apiGet } from '../utils/api'

export default function OrderSuccess() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const orderId = params.get('id') || undefined
  const totalNpr = params.get('total') ? Number(params.get('total')) : undefined
  const hasItemsParam = Boolean(params.get('items'))
  const [status, setStatus] = useState<string | null>(null)
  const items: OrderItem[] = useMemo(() => {
    const raw = params.get('items')
    if (raw) {
      try {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) {
          return arr.filter(Boolean).map((v) => ({ name: String(v.name || v), qty: Number(v.qty || 1) }))
        }
      } catch {
        // ignore malformed items
      }
    }
    // Fallback example
    return [
      { name: 'Milk Tea', qty: 2 },
      { name: 'Ginger Tea', qty: 1 },
    ]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()])

  const [itemsFromServer, setItemsFromServer] = useState<OrderItem[] | null>(null)
  useEffect(() => {
    async function load() {
      if (!orderId || hasItemsParam) return
      try {
        const o = await apiGet<{ items?: { name: string; qty?: number }[]; status?: string }>(`/api/orders/${orderId}`)
        if (Array.isArray(o?.items)) {
          setItemsFromServer(o.items.map((i) => ({ name: i.name, qty: Number(i.qty || 1) })))
        }
        if (o?.status) setStatus(String(o.status))
      } catch {
        // ignore
      }
    }
    load()
  }, [orderId, hasItemsParam])
  const itemsToShow = itemsFromServer && itemsFromServer.length ? itemsFromServer : items

  // Live status via SSE
  useEffect(() => {
    if (!orderId) return
    const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
    const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
    const src = new EventSource(`${apiBase}/api/orders/${orderId}/events`)
    const onStatusListener: EventListener = (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data as string)
        if (data?.status) setStatus(String(data.status))
      } catch {
        // ignore malformed SSE data
      }
    }
    src.addEventListener('status', onStatusListener)
    src.onerror = () => {
      try { src.close() } catch {
        // ignore close errors
      }
    }
    return () => {
      try {
        src.removeEventListener('status', onStatusListener)
        src.close()
      } catch {
        // ignore cleanup errors
      }
    }
  }, [orderId])

  return (
    <>
      <Meta title={t('order.success.title')} description={t('order.success.subtitle')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { label: t('brand'), href: `/${locale}/` },
            { label: t('order.success.breadcrumb'), href: `/${locale}/order/success` },
          ]}
        />
        <h1 className="text-3xl font-bold">{t('order.success.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{t('order.success.subtitle')}</p>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-[--color-surface] dark:bg-gray-900">
          {status && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-[--color-surface] text-[--color-primary] dark:text-[--color-accent]">
                {t(status === 'paid' ? 'order.status.paid' : 'order.status.received')}
              </span>
            </div>
          )}
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {orderId ? (
              <span>
                {t('order.success.summaryWithId')} <span className="font-mono">#{orderId}</span>
              </span>
            ) : (
              t('order.success.summary')
            )}
          </div>
          <ul className="text-sm list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300">
            {itemsToShow.map((it, i) => (
              <li key={i}>{it.qty || 1}× {it.name}</li>
            ))}
          </ul>
          <OrderShareCTA orderId={orderId} items={itemsToShow} totalNpr={totalNpr} />
        </div>
      </main>
    </>
  )
}
