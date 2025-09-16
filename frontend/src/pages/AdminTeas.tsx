import { useEffect, useMemo, useState } from 'react'

 type Tea = {
  titleNepali: string
  titleEnglish: string
  priceNpr: number
  available?: boolean
 }

 type Category = {
  key: string
  titleNepali: string
  titleEnglish: string
  teas: Tea[]
 }

 export default function AdminTeas() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/menu`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load menu')
        if (!cancelled) setCategories(Array.isArray(data.categories) ? data.categories : [])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [apiBase])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return categories
    return categories.map(c => ({
      ...c,
      teas: c.teas.filter(t => `${t.titleNepali} ${t.titleEnglish}`.toLowerCase().includes(q))
    })).filter(c => c.teas.length)
  }, [categories, filter])

  function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, type, durationMs: 3200 } }))
  }

  async function saveTea(catKey: string, tea: Tea, draft: { priceNpr?: number; available?: boolean }) {
    try {
      const body: Record<string, unknown> = {}
      if (typeof draft.available !== 'undefined') body.available = draft.available
      if (typeof draft.priceNpr !== 'undefined') body.priceNpr = draft.priceNpr
      if (!Object.keys(body).length) return
      const res = await fetch(`${apiBase}/api/menu/${encodeURIComponent(catKey)}/teas/${encodeURIComponent(tea.titleEnglish)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Update failed')
      // Update UI state
      setCategories(prev => prev.map(c => {
        if (c.key !== catKey) return c
        return {
          ...c,
          teas: c.teas.map(t => t.titleEnglish === tea.titleEnglish ? { ...t, ...body } as Tea : t)
        }
      }))
      toast('Updated', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Error updating', 'error')
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin • Teas</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Quickly toggle availability and update prices. This page is not linked in navigation.</p>
      </header>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="mb-4">
        <input
          type="search"
          placeholder="Filter by name…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-80 border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />
      </div>

      <div className="space-y-6">
        {filtered.map(cat => (
          <section key={cat.key} className="rounded border border-gray-200 dark:border-gray-800 p-4">
            <h2 className="font-semibold mb-3">{cat.titleNepali} <span className="text-sm text-gray-500">({cat.titleEnglish})</span></h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="py-2 pr-4">Title (NE)</th>
                    <th className="py-2 pr-4">Title (EN)</th>
                    <th className="py-2 pr-4">Price (Rs)</th>
                    <th className="py-2 pr-4">Available</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.teas.map((t) => (
                    <TeaRow key={t.titleEnglish} catKey={cat.key} tea={t} onSave={saveTea} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
 }

 function TeaRow({ catKey, tea, onSave }: { catKey: string; tea: Tea; onSave: (key: string, tea: Tea, draft: { priceNpr?: number; available?: boolean }) => Promise<void> }) {
  const [price, setPrice] = useState<string>(String(tea.priceNpr))
  const [available, setAvailable] = useState<boolean>(tea.available ?? true)
  const dirty = (Number(price) !== tea.priceNpr) || (available !== (tea.available ?? true))

  return (
    <tr className="border-t border-gray-200 dark:border-gray-800">
      <td className="py-2 pr-4">{tea.titleNepali}</td>
      <td className="py-2 pr-4">{tea.titleEnglish}</td>
      <td className="py-2 pr-4">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-28 border rounded px-2 py-1 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />
      </td>
      <td className="py-2 pr-4">
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
      </td>
      <td className="py-2 pr-4">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => onSave(catKey, tea, {
            priceNpr: Number(price),
            available,
          })}
          className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 disabled:opacity-50"
        >
          Save
        </button>
      </td>
    </tr>
  )
 }
