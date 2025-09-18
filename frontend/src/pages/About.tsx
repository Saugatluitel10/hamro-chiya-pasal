import { motion } from 'framer-motion'
import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'
import IconTeaLeaf from '../components/IconTeaLeaf'
import PatternBorder from '../components/PatternBorder'
import PrayerFlags from '../components/PrayerFlags'
import StructuredData from '../components/StructuredData'
import Breadcrumbs from '../components/Breadcrumbs'
import Lightbox from '../components/Lightbox'
import { formatNumberAuto } from '../utils/format'

type Region = 'Ilam' | 'Dhankuta' | 'Kaski'

// Regions list used for toggles; all displayed copy comes from i18n keys
const regions: Region[] = ['Ilam', 'Dhankuta', 'Kaski']

export default function About() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  const [active, setActive] = useState<Region>('Ilam')
  const foundedYear = 2019
  const years = new Date().getFullYear() - foundedYear
  const gallery = [
    {
      src: 'https://images.unsplash.com/photo-1541782814451-9c6779ed3403?q=80&w=1400&auto=format&fit=crop',
      alt: 'Pouring milk tea',
    },
    {
      src: 'https://images.unsplash.com/photo-1487029752779-a0c17b1f5ec9?q=80&w=1400&auto=format&fit=crop',
      alt: 'Loose leaf tea selection',
    },
    {
      src: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=1400&auto=format&fit=crop',
      alt: 'Clay cups and spices',
    },
    {
      src: 'https://images.unsplash.com/photo-1576092768246-db68cd0d4e43?q=80&w=1400&auto=format&fit=crop',
      alt: 'Green hills tea estates',
    },
  ]
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  return (
    <>
    <Meta title={t('meta.about.title')} description={t('meta.about.desc')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
    <StructuredData
      json={{
        '@context': 'https://schema.org',
        '@type': 'CafeOrCoffeeShop',
        name: 'Hamro Chiya Pasal',
        url: origin + '/',
        image: og,
        description: t('meta.about.desc'),
        telephone: '+977-9800000000',
        priceRange: 'Rs.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Thamel Marg',
          addressLocality: 'Kathmandu',
          postalCode: '44600',
          addressCountry: 'NP',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.7172,
          longitude: 85.3240,
        },
        servesCuisine: ['Tea', 'Nepali'],
        sameAs: [
          'https://www.instagram.com/hamro.chiya.pasal',
          'https://www.facebook.com/HamroChiyaPasal',
        ],
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '07:00', closes: '20:30' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '07:00', closes: '21:30' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '21:00' },
        ],
      }}
    />
    <StructuredData
      json={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('brand'), item: `${origin}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: t('nav.about'), item: `${origin}/${locale}/about` },
        ],
      }}
    />
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs
        items={[
          { label: t('brand'), href: `/${locale}/` },
          { label: t('nav.about'), href: `/${locale}/about` },
        ]}
      />
      {/* Business Story */}
      <section className="max-w-3xl">
        {/* Subtle cultural banner */}
        <div className="relative h-8 mb-1">
          <div className="absolute inset-0">
            <PrayerFlags className="opacity-70" height={36} />
          </div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2 flex items-center gap-2"
        >
          <IconTeaLeaf className="text-[--color-secondary]" />
          <span>{t('about.title')}</span>
        </motion.h1>
        <PatternBorder className="text-[--color-accent] mb-4" />
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>{t('about.story.p1')}</p>
          <p>{t('about.story.p2')}</p>
        </div>
      </section>

      {/* Stats (localized numbers) */}
      <section className="mt-8 grid sm:grid-cols-2 gap-4 max-w-3xl">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.stats.years')}</div>
          <div className="mt-1 text-2xl font-semibold">{formatNumberAuto(years, locale)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.stats.satisfaction')}</div>
          <div className="mt-1 text-2xl font-semibold">{formatNumberAuto(4.8, locale, { maximumFractionDigits: 1 })}/5</div>
        </div>
      </section>

      {/* Sourcing & Map */}
      <section className="mt-10 grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{t('about.sourcing.title')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('about.sourcing.subtitle')}</p>

          <div className="flex gap-2 mb-3">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setActive(r)}
                className={`rounded-full border px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ring-offset-white transition-colors ${
                  active === r
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {t(`about.region.${r.toLowerCase()}.name`)}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300 text-sm">{t(`about.region.${active.toLowerCase()}.blurb`)}</p>
            <ul className="mt-3 text-sm list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>{t('about.sourcing.list.1')}</li>
              <li>{t('about.sourcing.list.2')}</li>
              <li>{t('about.sourcing.list.3')}</li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-emerald-50 dark:bg-emerald-900/10"
        >
          {/* Simple map placeholder with markers */}
          <div
            className="aspect-[4/3] bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 p-4 flex items-end justify-start">
            <div className="rounded-md bg-white/90 dark:bg-gray-900/80 backdrop-blur px-3 py-2 text-sm shadow">{t('about.map.note')}</div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="mt-10 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-2">{t('about.values.title')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('about.values.subtitle')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['craft', 'community', 'sustainability', 'heritage', 'quality', 'warmth'].map((k, idx) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.05, 0.2) }}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900"
            >
              <div className="font-semibold">{t(`about.values.item.${k}.title`)}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t(`about.values.item.${k}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mt-10 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">A glimpse of our chai, craft, and places that inspire us.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((g, idx) => (
            <motion.button
              key={g.src}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              onClick={() => setGalleryIndex(idx)}
            >
              <img
                src={g.src}
                alt={g.alt}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="mt-10 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-2">{t('about.milestones.title')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('about.milestones.subtitle')}</p>
        <div className="space-y-4">
          {[1,2,3,4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900"
            >
              <div className="font-semibold">{t(`about.milestones.item.${i}.title`)}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t(`about.milestones.item.${i}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">{t('about.team.title')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('about.team.subtitle')}</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: 'bajai', roleKey: 'traditional', years: 30 },
            { id: 'aama', roleKey: 'masterBrewer', years: 20 },
            { id: 'bhai', roleKey: 'sourcingLead', years: 6 },
            { id: 'didi', roleKey: 'community', years: 8 },
            { id: 'kaka', roleKey: 'operations', years: 12 },
            { id: 'sathi', roleKey: 'barista', years: 3 },
            { id: 'mama', roleKey: 'qualityControl', years: 10 },
          ].map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900"
            >
              <div className="font-semibold">{t(`about.team.member.${m.id}`)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t(`about.team.role.${m.roleKey}`)}</div>
              <div className="mt-1 text-xs text-gray-500">{formatNumberAuto(m.years, locale)}{t('about.team.yearsSuffix')}</div>
            </motion.div>
          ))}
        </div>
      </section>
      {galleryIndex !== null ? (
        <Lightbox
          src={gallery[galleryIndex].src}
          alt={gallery[galleryIndex].alt}
          onClose={() => setGalleryIndex(null)}
        />
      ) : null}
    </main>
    </>
  )
}
