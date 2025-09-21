import { useMemo, useState } from 'react'
import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import { useCart } from '../hooks/useCart'
import { apiPost } from '../utils/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  const nav = useNavigate()
  const { items, total, updateQty, remove, clear } = useCart()
  const [busy, setBusy] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'stripe' | 'cod'>('esewa')

  const orderItems = useMemo(() => items.map((it) => ({ name: it.name, qty: it.qty, priceNpr: it.priceNpr })), [items])

  async function placeOrder() {
    if (items.length === 0) return
    setBusy(true)
    try {
      const data = await apiPost<{ id: string; totalNpr: number; items: { name: string; qty: number }[] }>(
        '/api/orders',
        { items: orderItems, paymentMethod }
      )
      if (paymentMethod === 'esewa') {
        // Create eSewa payment and redirect
        const pay = await apiPost<{ redirectUrl: string }>('/api/payments/esewa/create', {
          orderId: data.id,
          amount: data.totalNpr,
        })
        window.location.href = pay.redirectUrl
        return
      }
      if (paymentMethod === 'stripe') {
        // Create stripe intent (placeholder UI for now)
        try {
          await apiPost<{ clientSecret: string }>('/api/payments/stripe/create-intent', {
            amount: data.totalNpr,
            currency: 'npr',
          })
          window.dispatchEvent(
            new CustomEvent('app:toast', { detail: { message: 'Stripe checkout coming soon. Using COD flow temporarily.', type: 'info' } })
          )
        } catch {
          // ignore create-intent errors in placeholder flow
        }
        // Fall through to success as COD for now
      }
      // COD or temporary Stripe fallback: redirect to success
      const qs = new URLSearchParams()
      qs.set('id', data.id)
      qs.set('total', String(data.totalNpr))
      qs.set('items', JSON.stringify(data.items.map((i) => ({ name: i.name, qty: i.qty }))))
      clear()
      nav(`/${locale}/order/success?` + qs.toString())
    } catch {
      window.dispatchEvent(
        new CustomEvent('app:toast', { detail: { message: t('checkout.error'), type: 'error' } })
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Meta title={t('checkout.title')} description={t('checkout.subtitle')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { label: t('brand'), href: `/${locale}/` },
            { label: t('checkout.breadcrumb'), href: `/${locale}/checkout` },
          ]}
        />
        <h1 className="text-3xl font-bold">{t('checkout.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{t('checkout.subtitle')}</p>

        {items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{t('checkout.empty')}</div>
            <Link to={`/${locale}/menu`} className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700">
              {t('checkout.goToMenu')}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-2">{t('checkout.items')}</h2>
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {items.map((it) => (
                  <li key={it.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-500">NPR {it.priceNpr}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)}
                        className="w-16 border rounded px-2 py-1 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      />
                      <button type="button" onClick={() => remove(it.id)} className="text-sm text-rose-600 hover:underline">
                        {t('checkout.remove')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-2">{t('checkout.summary')}</h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{t('checkout.total')}: NPR {total}</div>
              <label className="block text-sm mb-1">{t('checkout.paymentMethod')}</label>
              <select
                value={paymentMethod}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value as 'esewa' | 'stripe' | 'cod')}
                className="w-full border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-3"
              >
                <option value="esewa">eSewa</option>
                <option value="stripe">Stripe</option>
                <option value="cod">{t('checkout.cod')}</option>
              </select>
              <button
                type="button"
                disabled={busy}
                onClick={placeOrder}
                className="w-full inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700 disabled:opacity-60"
              >
                {busy ? t('common.loading') : t('checkout.placeOrder')}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
