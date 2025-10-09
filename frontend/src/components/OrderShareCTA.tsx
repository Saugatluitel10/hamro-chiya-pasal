import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'

export type OrderItem = { name: string; qty?: number }

export default function OrderShareCTA({ orderId, items, totalNpr }: { orderId?: string; items: OrderItem[]; totalNpr?: number }) {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  const share = async () => {
    try {
      setBusy(true)
      const res = await fetch(`${apiBase}/api/social/order/share-ready`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, items, totalNpr }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed')
      const text: string = data.text
      const url: string | undefined = data.url
      if (navigator.share) {
        try {
          await navigator.share({ title: t('brand'), text, url })
          return
        } catch {
          // ignore user cancel
        }
      }
      const wa = data.whatsapp as string
      const tw = data.twitter as string
      const fb = data.facebook as string
      window.open(wa, '_blank')
      setTimeout(() => window.open(tw, '_blank'), 300)
      setTimeout(() => window.open(fb, '_blank'), 600)
    } catch {
      // noop
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" disabled={busy} onClick={share} className="inline-flex items-center justify-center rounded-md bg-[--color-primary] text-white px-3 py-2 text-sm hover:bg-[#6f1616] disabled:opacity-60">
      {busy ? t('common.loading') : t('order.share.cta')}
    </button>
  )
}
