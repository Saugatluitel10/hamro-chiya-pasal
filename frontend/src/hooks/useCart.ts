import { useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  priceNpr: number
  qty: number
}

const KEY = 'cart_items'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore read errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // ignore write errors
    }
  }, [items])

  const total = useMemo(() => items.reduce((s, it) => s + it.qty * it.priceNpr, 0), [items])

  function add(item: Omit<CartItem, 'qty'>, qty = 1) {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { ...item, qty }]
    })
  }
  function updateQty(id: string, qty: number) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)))
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }
  function clear() {
    setItems([])
  }
  return { items, total, add, updateQty, remove, clear }
}
