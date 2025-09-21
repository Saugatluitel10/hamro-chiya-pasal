import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TeaCard from '../components/TeaCard'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'
import IconTeaLeaf from '../components/IconTeaLeaf'
import PatternBorder from '../components/PatternBorder'
import MountainSilhouette from '../components/MountainSilhouette'
import PrayerFlags from '../components/PrayerFlags'
import StructuredData from '../components/StructuredData'
import NewsletterForm from '../components/NewsletterForm'
import Lightbox from '../components/Lightbox'
import InstagramFeed from '../components/InstagramFeed'
import UGCForm from '../components/UGCForm'
import GoogleReviews from '../components/GoogleReviews'

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
  const heroImages = [
    { id: 'pouring', src: 'https://images.unsplash.com/photo-1541782814451-9c6779ed3403?q=80&w=1600&auto=format&fit=crop' },
    { id: 'loose',   src: 'https://images.unsplash.com/photo-1487029752779-a0c17b1f5ec9?q=80&w=1600&auto=format&fit=crop' },
    { id: 'clay',    src: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=1600&auto=format&fit=crop' },
  ] as const
  const trackRef = useRef<HTMLDivElement>(null)
  const heroPrev = () => { const el = trackRef.current; if (!el) return; el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' }) }
  const heroNext = () => { const el = trackRef.current; if (!el) return; el.scrollBy({ left: el.clientWidth, behavior: 'smooth' }) }
  const gallery = [
    { id: 'pouring', src: 'https://images.unsplash.com/photo-1541782814451-9c6779ed3403?q=80&w=1400&auto=format&fit=crop' },
    { id: 'loose',   src: 'https://images.unsplash.com/photo-1487029752779-a0c17b1f5ec9?q=80&w=1400&auto=format&fit=crop' },
    { id: 'clay',    src: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=1400&auto=format&fit=crop' },
    { id: 'hills',   src: 'https://images.unsplash.com/photo-1576092768246-db68cd0d4e43?q=80&w=1400&auto=format&fit=crop' },
  ] as const
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const openGallery = (i: number) => setGalleryIndex(i)
  const closeGallery = () => setGalleryIndex(null)
  const prevGallery = () => setGalleryIndex((i) => (i === null ? i : (i + gallery.length - 1) % gallery.length))
  const nextGallery = () => setGalleryIndex((i) => (i === null ? i : (i + 1) % gallery.length))
  const current = galleryIndex !== null ? gallery[galleryIndex] : null
  const currentCaption = current ? t(`gallery.items.${current.id}.caption`) : ''

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
            {/* Hero mini carousel */}
            <div className="relative mt-5">
              <div ref={trackRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: 'none' }}>
                {heroImages.map((img) => (
                  <div key={img.id} className="group relative snap-start min-w-[75%] md:min-w-[50%] h-36 rounded-lg overflow-hidden border border-white/20">
                    <img src={img.src} alt={t(`gallery.items.${img.id}.caption`)} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 text-xs text-white/90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {t(`gallery.items.${img.id}.caption`)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
                <button type="button" onClick={heroPrev} className="pointer-events-auto hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30">‹</button>
                <button type="button" onClick={heroNext} className="pointer-events-auto hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30">›</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* UGC Submission */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900">
          <h2 className="text-2xl font-bold">{t('ugc.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{t('ugc.desc')}</p>
          <UGCForm />
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{t('home.gallery.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('home.gallery.desc')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((g, idx) => (
            <motion.button
              key={g.src}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              onClick={() => openGallery(idx)}
            >
              <img
                src={g.src}
                alt={t(`gallery.items.${g.id}.caption`)}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-1 left-1 right-1 text-[11px] px-1 py-0.5 rounded bg-black/40 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                {t(`gallery.items.${g.id}.caption`)}
              </div>
            </motion.button>
          ))}
        </div>
      </section>
      {/* Gallery CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-[--color-surface] dark:bg-gray-900 flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">{t('gallery.cta.title')}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('gallery.cta.desc')}</p>
          </div>
          <Link to={`/${locale}/gallery`} className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700">
            {t('gallery.cta.button')}
          </Link>
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

      {/* Newsletter signup */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-[--color-surface] dark:bg-gray-900">
          <h2 className="text-2xl font-bold">{t('newsletter.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t('newsletter.subtitle')}</p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
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

      {/* Instagram Feed */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="mb-3">
          <h2 className="text-2xl font-bold">{t('home.instagram.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('home.instagram.desc')}</p>
        </div>
        <InstagramFeed limit={8} />
      </section>

      {/* Social Proof */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-[--color-surface] dark:bg-gray-900">
          <h2 className="text-2xl font-bold">{t('socialproof.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{t('socialproof.subtitle')}</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">{t('socialproof.badge.trusted')}</div>
            <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">{t('socialproof.badge.payments')}</div>
            <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">{t('socialproof.badge.delivery')}</div>
          </div>
          <div className="mt-4">
            <GoogleReviews />
          </div>
        </div>
      </section>

        {current ? (
          <Lightbox
            src={current.src}
            alt={currentCaption}
            caption={currentCaption}
            onClose={closeGallery}
            onPrev={prevGallery}
            onNext={nextGallery}
          />
        ) : null}
    </main>
    </>
  )
}
