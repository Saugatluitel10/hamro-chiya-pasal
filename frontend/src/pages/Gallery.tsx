import { useState } from 'react'
import Meta from '../components/Meta'
import StructuredData from '../components/StructuredData'
import Breadcrumbs from '../components/Breadcrumbs'
import Lightbox from '../components/Lightbox'
import { useI18n } from '../i18n/I18nProvider'
import { motion } from 'framer-motion'

export default function Gallery() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  const items = [
    { id: 'pouring', src: 'https://images.unsplash.com/photo-1541782814451-9c6779ed3403?q=80&w=1400&auto=format&fit=crop' },
    { id: 'loose',   src: 'https://images.unsplash.com/photo-1487029752779-a0c17b1f5ec9?q=80&w=1400&auto=format&fit=crop' },
    { id: 'clay',    src: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=1400&auto=format&fit=crop' },
    { id: 'hills',   src: 'https://images.unsplash.com/photo-1576092768246-db68cd0d4e43?q=80&w=1400&auto=format&fit=crop' },
  ] as const
  const [idx, setIdx] = useState<number | null>(null)

  const open = (i: number) => setIdx(i)
  const close = () => setIdx(null)
  const prev = () => setIdx((i) => (i === null ? i : (i + items.length - 1) % items.length))
  const next = () => setIdx((i) => (i === null ? i : (i + 1) % items.length))

  const current = idx !== null ? items[idx] : null
  const caption = current ? t(`gallery.items.${current.id}.caption`) : ''

  return (
    <>
      <Meta title={t('gallery.title')} description={t('gallery.desc')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: t('gallery.title'),
          url,
        }}
      />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('brand'), item: `${origin}/${locale}/` },
            { '@type': 'ListItem', position: 2, name: t('gallery.title'), item: `${origin}/${locale}/gallery` },
          ],
        }}
      />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('gallery.title'), href: `/${locale}/gallery` }]} />
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">{t('gallery.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('gallery.desc')}</p>
        </header>
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((g, i) => (
            <motion.button
              key={g.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              onClick={() => open(i)}
            >
              <img src={g.src} alt={t(`gallery.items.${g.id}.caption`)} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </section>
        {current ? (
          <Lightbox src={current.src} alt={caption} caption={caption} onClose={close} onPrev={prev} onNext={next} />
        ) : null}
      </main>
    </>
  )
}
