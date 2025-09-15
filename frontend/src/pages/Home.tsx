import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TeaCard from '../components/TeaCard'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'
import IconTeaLeaf from '../components/IconTeaLeaf'
import PatternBorder from '../components/PatternBorder'
import MountainSilhouette from '../components/MountainSilhouette'
import PrayerFlags from '../components/PrayerFlags'
import StructuredData from '../components/StructuredData'

function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)
  const prefersReduced = useReducedMotion()
  useEffect(() => {
    if (prefersReduced) {
      setDisplay(to)
      return
    }
    const controls = animate(count, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [count, to, duration, prefersReduced])
  return <span>{display}</span>
}

export default function Home() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  const prefersReduced = useReducedMotion()
  const featured = [
    {
      titleNepali: 'दूध चिया',
      titleEnglish: 'Dudh Chiya',
      priceNpr: 25,
      imageUrl: 'https://images.unsplash.com/photo-1531934786730-f9bde0f92ea1?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'कालो चिया',
      titleEnglish: 'Kalo Chiya',
      priceNpr: 20,
      imageUrl: 'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'अदरक चिया',
      titleEnglish: 'Adrak Chiya',
      priceNpr: 30,
      imageUrl: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'इलाम गोल्ड',
      titleEnglish: 'Ilam Gold',
      priceNpr: 50,
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'हिमालयन ग्रीन',
      titleEnglish: 'Himalayan Green',
      priceNpr: 45,
      imageUrl: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'सिल्भर टिप्स',
      titleEnglish: 'Silver Tips',
      priceNpr: 60,
      imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  return (
    <>
      <Meta
        title={t('meta.home.title')}
        description={t('meta.home.desc')}
        url={url}
        image={og}
        locale={ogLocale}
        localizedUrlStrategy="prefix"
      />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: featured.map((ft, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'Product',
              name: locale === 'ne' ? ft.titleNepali : ft.titleEnglish,
              image: ft.imageUrl,
              brand: { '@type': 'Brand', name: 'Hamro Chiya Pasal' },
              offers: {
                '@type': 'Offer',
                price: ft.priceNpr,
                priceCurrency: 'NPR',
                availability: 'https://schema.org/InStoreOnly',
                url,
              },
            },
          })),
        }}
      />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t('brand'),
              item: `${origin}/${locale}/`,
            },
          ],
        }}
      />
      <main className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero with background image */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(6, 95, 70, 0.35), rgba(6, 95, 70, 0.6)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        {/* Prayer flags overlay at the top */}
        <div className="absolute inset-x-0 top-0 z-0 pointer-events-none">
          <PrayerFlags className="opacity-90" height={70} />
        </div>
        {/* Mountain silhouette overlay (above bg, behind content) */}
        <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none">
          <MountainSilhouette className="text-white/30 dark:text-white/20" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-8 items-center text-white relative z-10">
          <motion.div initial={prefersReduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={prefersReduced ? { duration: 0 } : { duration: 0.5 }}>
            <p className="text-emerald-200 font-semibold mb-2">{t('home.hero.tagline')}</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <IconTeaLeaf className="text-[--color-accent]" />
              <span>{t('home.hero.title')}</span>
            </h1>
            <PatternBorder className="text-[--color-accent] mb-4" />
            <p className="text-white/90 mb-6 max-w-prose">{t('home.hero.subtitle')}</p>
            <div className="flex items-center gap-3">
              <Link
                to={`/${locale}/menu`}
                className="inline-flex items-center justify-center rounded-md bg-white/90 text-emerald-900 px-4 py-2 font-medium hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2"
              >
                {t('home.cta.menu')}
              </Link>
              <Link
                to={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-md border border-white/60 px-4 py-2 font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2"
              >
                {t('home.cta.contact')}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">🏔️ {t('home.chips.himalaya')}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">🍃 {t('home.chips.ilam')}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">🇳🇵 {t('home.chips.authentic')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured teas */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <IconTeaLeaf className="text-[--color-secondary]" />
              <span>{t('home.featured.title')}</span>
            </h2>
            <PatternBorder className="text-[--color-accent] my-2" />
            <p className="text-gray-600 dark:text-gray-300">{t('home.featured.subtitle')}</p>
          </div>
          <Link to={`/${locale}/menu`} className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline">
            {t('home.featured.link')}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((t) => (
            <TeaCard key={t.titleNepali} {...t} />
          ))}
        </div>
      </section>

      {/* Business highlights */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"><Counter to={7} />+ </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.years')}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"><Counter to={98} />% </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('home.stats.satisfaction')}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900">
            <div className="font-semibold mb-1">{t('home.stats.locationHours')}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('home.location.city')}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('home.hours.summary')}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900">
            <div className="font-semibold mb-2">{t('home.stats.authenticity')}</div>
            <div className="flex flex-wrap gap-2">
              {[t('home.badges.ilamSourced'), t('home.badges.handBrewed'), t('home.badges.freshSpices')].map((b) => (
                <span key={b} className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-900/40 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { name: t('home.testimonials.1.name'), quote: t('home.testimonials.1.quote') },
            { name: t('home.testimonials.2.name'), quote: t('home.testimonials.2.quote') },
            { name: t('home.testimonials.3.name'), quote: t('home.testimonials.3.quote') },
          ].map((item) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">“{item.quote}”</p>
              <footer className="mt-2 text-xs text-gray-500">— {item.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>
    </main>
    </>
  )
}
