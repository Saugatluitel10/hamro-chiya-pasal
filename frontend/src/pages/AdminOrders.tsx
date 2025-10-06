import { useEffect, useState } from 'react'
import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'
import { apiGet, apiPatch } from '../utils/api'

export default function AdminOrders() {
  const { locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  type Item = { name: string; qty: number; priceNpr?: number }
  type Order = { id: string; items: Item[]; totalNpr: number; status: string; createdAt: number }

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<Order[]>('/api/orders?limit=100')
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function setStatus(id: string, status: string) {
    try {
      await apiPatch(`/api/orders/${id}/status`, { status })
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: `Updated ${id} → ${status}`, type: 'success' } }))
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch (e) {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: (e as Error).message || 'Failed', type: 'error' } }))
    }
  }

  return (
    <>
      <Meta title="Admin Orders" description="Manage orders" url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Admin Orders</h1>
          <button type="button" onClick={load} className="text-sm px-3 py-2 rounded border">Refresh</button>
        </div>
        {loading ? (
          <div className="text-sm">Loading…</div>
        ) : error ? (
          <div className="text-sm text-rose-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-sm">No orders</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 dark:border-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="text-left p-2 border-b">ID</th>
                  <th className="text-left p-2 border-b">Items</th>
                  <th className="text-left p-2 border-b">Total (NPR)</th>
                  <th className="text-left p-2 border-b">Status</th>
                  <th className="text-left p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="p-2 font-mono">{o.id}</td>
                    <td className="p-2">
                      <ul className="list-disc pl-5">
                        {o.items.slice(0, 5).map((it, idx) => (
                          <li key={idx}>{it.qty}× {it.name}</li>
                        ))}
                        {o.items.length > 5 ? <li>…</li> : null}
                      </ul>
                    </td>
                    <td className="p-2">{o.totalNpr}</td>
                    <td className="p-2"><span className="inline-flex text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{o.status}</span></td>
                    <td className="p-2">
                      <div className="flex gap-2 flex-wrap">
                        {['received','brewing','ready','paid','completed'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(o.id, s)}
                            className={`text-xs px-2 py-1 rounded border ${o.status===s? 'opacity-60' : ''}`}
                          >{s}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}
