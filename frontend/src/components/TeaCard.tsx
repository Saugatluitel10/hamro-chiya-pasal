import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Lightbox from './Lightbox'
import { formatCurrencyNprAuto } from '../utils/format'
import { useCart } from '../hooks/useCart'

export type TeaCardProps = {
  titleNepali: string
  titleEnglish?: string
  priceNpr?: number
  imageUrl?: string
  ingredients?: string[]
  healthBenefits?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  seasonal?: boolean
  available?: boolean
  highlight?: string
  bestSeller?: boolean
  isNew?: boolean
  discountPct?: number
}

export default function TeaCard({
  titleNepali,
  titleEnglish,
  priceNpr,
  imageUrl,
  ingredients,
  healthBenefits,
  difficulty,
  seasonal,
  available = true,
  highlight,
  bestSeller,
  isNew,
  discountPct,
}: TeaCardProps) {
  const { t, locale } = useI18n()
  const [lb, setLb] = useState(false)
  const [open, setOpen] = useState(false)
  const { add } = useCart()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const diffText = difficulty ? t(`teacard.diff.${String(difficulty).toLowerCase()}`) : undefined
  const highlightText = (text?: string) => {
    if (!text) return text
    const q = (highlight || '').trim()
    if (!q) return text
    try {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const parts = text.split(rx)
      const matches = text.match(rx)
      if (!matches) return text
      const nodes: ReactNode[] = []
      for (let i = 0; i < parts.length; i++) {
        nodes.push(parts[i])
        if (i < parts.length - 1) {
          nodes.push(
            <mark key={i} className="bg-yellow-200 text-yellow-900 dark:bg-yellow-700/50 dark:text-yellow-100 rounded px-0.5">
              {matches[i]}
            </mark>
          )
        }
      }
      return <>{nodes}</>
    } catch {
      return text
    }
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.25 }}
      className={
        (locale === 'en'
          ? 'group overflow-hidden rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors '
          : 'group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-[--color-surface] dark:bg-gray-900 shadow hover:shadow-md transition-shadow ') +
        (available ? '' : 'opacity-90')
      }
    >
      {imageUrl && (
        <div className={`relative ${locale === 'en' ? 'h-48' : 'h-40'} w-full overflow-hidden`}>
          <picture>
            <source
              type="image/avif"
              srcSet={`${imageUrl}&fm=avif&w=480 480w, ${imageUrl}&fm=avif&w=768 768w, ${imageUrl}&fm=avif&w=1024 1024w`}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <source
              type="image/webp"
              srcSet={`${imageUrl}&fm=webp&w=480 480w, ${imageUrl}&fm=webp&w=768 768w, ${imageUrl}&fm=webp&w=1024 1024w`}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <img
              src={`${imageUrl}&w=1024`}
              alt={titleEnglish || titleNepali}
              className={
                'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in ' +
                (available ? '' : 'grayscale')
              }
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              width={1024}
              height={480}
              onClick={() => setLb(true)}
            />
          </picture>
          {bestSeller && (
            <div className="absolute left-2 top-2 rounded bg-[--color-accent] text-white px-2 py-0.5 text-xs font-semibold shadow">
              {t('teacard.bestSeller') || 'Best Seller'}
            </div>
          )}
          {isNew && (
            <div className="absolute left-2 top-2 translate-y-6 rounded bg-emerald-600 text-white px-2 py-0.5 text-xs font-semibold shadow">
              {t('teacard.new') || 'New'}
            </div>
          )}
          {typeof discountPct === 'number' && discountPct > 0 && (
            <div className="absolute right-2 top-2 rounded bg-amber-500 text-white px-2 py-0.5 text-xs font-semibold shadow">
              -{discountPct}%
            </div>
          )}
          {seasonal && (
            <div className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-xs font-medium text-white shadow">
              {t('teacard.seasonal')}
            </div>
          )}
          {!available && (
            <div className="absolute right-2 top-2 rounded bg-rose-600 px-2 py-0.5 text-xs font-medium text-white shadow">
              {t('teacard.unavailable') || 'Unavailable'}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{highlightText(titleNepali)}</h3>
            {titleEnglish && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{highlightText(titleEnglish)}</p>
            )}
          </div>
          {typeof priceNpr === 'number' && (
            <div className="shrink-0 rounded-md bg-[--color-surface] px-2 py-1 text-sm font-semibold text-[--color-primary] dark:text-[--color-accent]">
              {t('teacard.pricePrefix')} {formatCurrencyNprAuto(priceNpr, locale)}
            </div>
          )}
        </div>

        {(ingredients?.length || healthBenefits?.length || difficulty) && (
          <div className="mt-3 space-y-2 text-sm">
            {ingredients?.length ? (
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('teacard.ingredients')}</span> {ingredients.join(', ')}
              </p>
            ) : null}
            {healthBenefits?.length ? (
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('teacard.benefits')}</span> {healthBenefits.join(', ')}
              </p>
            ) : null}
            {difficulty ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('teacard.brew')}</span> {diffText}</span>
              </div>
            ) : null}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button type="button" className="btn-secondary text-xs" onClick={() => setOpen(true)}>
            {t('teacard.viewDetails') || 'View details'}
          </button>
          {typeof priceNpr === 'number' && (
            <button
              type="button"
              className="btn-primary text-xs"
              onClick={() => {
                const id = (titleEnglish || titleNepali).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                add({ id, name: titleEnglish || titleNepali, priceNpr }, 1)
                window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: t('cart.added'), type: 'success' } }))
              }}
            >
              {t('cart.add')}
            </button>
          )}
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={async () => {
              const title = titleEnglish || titleNepali
              const url = `${origin}/${locale}/menu`
              const text = `${t('share.checkout')} ${title} — ${url}`
              try {
                if (navigator.share) {
                  await navigator.share({ title, text, url })
                  return
                }
              } catch {
                // ignore share cancellation
              }
              const w = encodeURIComponent(text)
              const tw = `https://twitter.com/intent/tweet?text=${w}`
              const wa = `https://wa.me/?text=${w}`
              const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
              window.open(wa, '_blank')
              setTimeout(() => window.open(tw, '_blank'), 300)
              setTimeout(() => window.open(fb, '_blank'), 600)
            }}
          >
            {t('share.button')}
          </button>
        </div>
      </div>
      {lb && imageUrl ? <Lightbox src={imageUrl} alt={titleEnglish || titleNepali} onClose={() => setLb(false)} /> : null}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-[92vw] max-w-md rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{titleEnglish || titleNepali}</h3>
                {titleEnglish && <p className="text-sm text-gray-600 dark:text-gray-400">{titleNepali}</p>}
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">×</button>
            </div>
            {imageUrl && (
              <div className="mt-3 rounded overflow-hidden">
                <img src={imageUrl} alt={titleEnglish || titleNepali} className="w-full h-48 object-cover" loading="lazy" />
              </div>
            )}
            <div className="mt-3 space-y-2 text-sm">
              {ingredients?.length ? (
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('teacard.ingredients')}</span> {ingredients.join(', ')}</p>
              ) : null}
              {healthBenefits?.length ? (
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('teacard.benefits')}</span> {healthBenefits.join(', ')}</p>
              ) : null}
              {difficulty ? (
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('teacard.brew')}</span> {diffText}</p>
              ) : null}
            </div>
            {typeof priceNpr === 'number' && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="btn-primary text-xs"
                  onClick={() => {
                    const id = (titleEnglish || titleNepali).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    add({ id, name: titleEnglish || titleNepali, priceNpr }, 1)
                    setOpen(false)
                    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: t('cart.added'), type: 'success' } }))
                  }}
                >
                  {t('cart.add')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.article>
  )
}
