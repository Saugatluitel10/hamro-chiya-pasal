import { motion } from 'framer-motion'
import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'
import IconTeaLeaf from '../components/IconTeaLeaf'
import PatternBorder from '../components/PatternBorder'
import PrayerFlags from '../components/PrayerFlags'
import StructuredData from '../components/StructuredData'

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
              <div className="mt-1 text-xs text-gray-500">{m.years}{t('about.team.yearsSuffix')}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    </>
  )
}
