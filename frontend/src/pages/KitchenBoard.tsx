import { useEffect, useMemo, useRef, useState } from 'react'
import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'
import { apiGet, apiPatch } from '../utils/api'

type Item = { name: string; qty: number; priceNpr?: number }
type Order = { id: string; items: Item[]; totalNpr: number; status: string; createdAt: number }

export default function KitchenBoard() {
  const { locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sourcesRef = useRef<Record<string, EventSource>>({})
  const attemptsRef = useRef<Record<string, number>>({})
  const mountedRef = useRef(true)

  const grouped = useMemo(() => {
    const by: Record<string, Order[]> = { received: [], brewing: [], ready: [], paid: [], completed: [] }
    for (const o of orders) {
      (by[o.status] || (by[o.status] = [])).push(o)
    }
    return by
  }, [orders])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<Order[]>('/api/orders?limit=100')
      const list = (Array.isArray(data) ? data : []) as Order[]
      setOrders(list)
      // Start/refresh SSE per order
      attachSse(list)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    return () => {
      // cleanup SSE
      Object.values(sourcesRef.current).forEach((es) => {
        try { es.close() } catch { /* ignore */ }
      })
      sourcesRef.current = {}
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function attachSse(list: Order[]) {
    const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
    const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
    const connect = (o: Order) => {
      // Reset attempts on fresh connect
      attemptsRef.current[o.id] = 0
      const src = new EventSource(`${apiBase}/api/orders/${o.id}/events`)
      const onStatus: EventListener = (ev) => {
        try {
          const data = JSON.parse((ev as MessageEvent).data as string)
          if (data?.status) {
            setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: String(data.status) } : x)))
          }
        } catch {
          // ignore malformed data
        }
      }
      src.addEventListener('status', onStatus)
      src.onerror = () => {
        try { src.close() } catch { /* ignore */ }
        delete sourcesRef.current[o.id]
        const n = (attemptsRef.current[o.id] || 0) + 1
        attemptsRef.current[o.id] = n
        const delay = Math.min(30000, 1000 * 2 ** Math.min(n, 5))
        if (!mountedRef.current) return
        setTimeout(() => {
          if (!mountedRef.current) return
          if (sourcesRef.current[o.id]) return // already reconnected
          connect(o)
        }, delay)
      }
      sourcesRef.current[o.id] = src
    }
    for (const o of list) {
      if (!sourcesRef.current[o.id]) connect(o)
    }
  }

  async function setStatus(id: string, status: string) {
    try {
      await apiPatch(`/api/orders/${id}/status`, { status })
      // Optimistic update; SSE will also reflect change
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch (e) {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: (e as Error).message || 'Failed', type: 'error' } }))
    }
  }

  function Column({ title, name }: { title: string; name: keyof typeof grouped }) {
    const list = grouped[name]
    return (
      <div className="flex-1 min-w-[260px]">
        <h2 className="text-lg font-semibold mb-2">{title} ({list.length})</h2>
        <div className="space-y-3">
          {list.map((o) => (
            <div key={o.id} className="rounded border border-gray-200 dark:border-gray-800 p-3 bg-[--color-surface] dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm">#{o.id}</div>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{o.status}</span>
              </div>
              <ul className="text-sm list-disc pl-5 mt-2">
                {o.items.slice(0, 6).map((it, idx) => (
                  <li key={idx}>{it.qty}× {it.name}</li>
                ))}
                {o.items.length > 6 ? <li>…</li> : null}
              </ul>
              <div className="flex gap-2 mt-3 flex-wrap">
                {name === 'received' && (
                  <button type="button" onClick={() => setStatus(o.id, 'brewing')} className="text-xs px-2 py-1 rounded border">Start Brewing</button>
                )}
                {name === 'brewing' && (
                  <button type="button" onClick={() => setStatus(o.id, 'ready')} className="text-xs px-2 py-1 rounded border">Mark Ready</button>
                )}
                {name === 'ready' && (
                  <button type="button" onClick={() => setStatus(o.id, 'completed')} className="text-xs px-2 py-1 rounded border">Complete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Meta title="Kitchen Board" description="Orders in progress" url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Kitchen Board</h1>
          <div className="flex items-center gap-2">
            <button type="button" onClick={load} className="text-sm px-3 py-2 rounded border">Refresh</button>
          </div>
        </div>
        {loading ? (
          <div className="text-sm">Loading…</div>
        ) : error ? (
          <div className="text-sm text-rose-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <Column title="Received" name="received" />
            <Column title="Brewing" name="brewing" />
            <Column title="Ready" name="ready" />
          </div>
        )}
      </main>
    </>
  )
}
