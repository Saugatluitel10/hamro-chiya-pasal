import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Meta from '../components/Meta'
import TeaCard from '../components/TeaCard'
import { useI18n } from '../i18n/I18nProvider'

type Tea = {
  titleNepali: string
  titleEnglish: string
  priceNpr: number
  imageUrl?: string
  ingredients?: string[]
  healthBenefits?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  seasonal?: boolean
}

type Category = {
  key: string
  titleNepali: string
  titleEnglish: string
  teas: Tea[]
}

const fallbackCategories: Category[] = [
  {
    key: 'traditional',
    titleNepali: 'पारम्परिक चिया',
    titleEnglish: 'Traditional Teas',
    teas: [
      {
        titleNepali: 'दूध चिया',
        titleEnglish: 'Dudh Chiya',
        priceNpr: 25,
        imageUrl:
          'https://images.unsplash.com/photo-1542444459-48fa3000b004?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['दूध', 'कालो चिया', 'चिनी'],
        healthBenefits: ['ऊर्जा', 'आराम'],
        difficulty: 'Easy',
      },
      {
        titleNepali: 'कालो चिया',
        titleEnglish: 'Kalo Chiya',
        priceNpr: 20,
        imageUrl:
          'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['कालो चिया', 'तातो पानी'],
        healthBenefits: ['एन्टिअक्सिडेन्ट'],
        difficulty: 'Easy',
      },
      {
        titleNepali: 'अदरक चिया',
        titleEnglish: 'Adrak Chiya',
        priceNpr: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['अदरक', 'दूध', 'चिया पत्ती'],
        healthBenefits: ['घाँटी दुखाइको राहत', 'ताप घटाउँछ'],
        difficulty: 'Medium',
      },
      {
        titleNepali: 'इलायची चिया',
        titleEnglish: 'Elaichi Chiya',
        priceNpr: 35,
        imageUrl:
          'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['इलायची', 'दूध', 'चिया पत्ती'],
        healthBenefits: ['पाचन सुधार'],
        difficulty: 'Medium',
      },
    ],
  },
  {
    key: 'premium',
    titleNepali: 'प्रीमियम चिया',
    titleEnglish: 'Premium Teas',
    teas: [
      {
        titleNepali: 'इलाम गोल्ड',
        titleEnglish: 'Ilam Gold',
        priceNpr: 50,
        imageUrl:
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['उच्च गुणस्तरको पत्ती'],
        healthBenefits: ['समृद्ध स्वाद', 'एरोमा'],
        difficulty: 'Medium',
        seasonal: false,
      },
      {
        titleNepali: 'हिमालयन ग्रीन',
        titleEnglish: 'Himalayan Green',
        priceNpr: 45,
        imageUrl:
          'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['ग्रीन टी'],
        healthBenefits: ['डिटक्स', 'मेटाबोलिज्म'],
        difficulty: 'Medium',
      },
      {
        titleNepali: 'सिल्भर टिप्स',
        titleEnglish: 'Silver Tips',
        priceNpr: 60,
        imageUrl:
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['बड्स मात्र'],
        healthBenefits: ['हल्का र सुगन्धित'],
        difficulty: 'Hard',
        seasonal: true,
      },
    ],
  },
  {
    key: 'herbal',
    titleNepali: 'जडिबुटी चिया',
    titleEnglish: 'Herbal Teas',
    teas: [
      {
        titleNepali: 'तुलसी चिया',
        titleEnglish: 'Tulsi Tea',
        priceNpr: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1542806100-91272a208e38?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['तुलसी', 'मधु (वैकल्पिक)'],
        healthBenefits: ['सर्दी-खोकीमा लाभदायक'],
        difficulty: 'Easy',
      },
      {
        titleNepali: 'नेटल चिया',
        titleEnglish: 'Nettle Tea',
        priceNpr: 35,
        imageUrl:
          'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['नेटल पात'],
        healthBenefits: ['खनिज तत्वले भरिपूर्ण'],
        difficulty: 'Medium',
        seasonal: true,
      },
      {
        titleNepali: 'लेमन ग्रास',
        titleEnglish: 'Lemon Grass',
        priceNpr: 25,
        imageUrl:
          'https://images.unsplash.com/photo-1598184277221-37d4f243c38b?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['लेमन ग्रास', 'मधु (वैकल्पिक)'],
        healthBenefits: ['सुगन्धित, शान्तिदायक'],
        difficulty: 'Easy',
        seasonal: false,
      },
    ],
  },
]

export default function Menu() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/menu`
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  // English details for fallback data (only used when API is unavailable)
  const fallbackEnglishDetail: Record<string, { ingredients?: string[]; healthBenefits?: string[] }> = {
    'Dudh Chiya': {
      ingredients: ['Milk', 'Black tea', 'Sugar'],
      healthBenefits: ['Energy', 'Comfort'],
    },
    'Kalo Chiya': {
      ingredients: ['Black tea', 'Hot water'],
      healthBenefits: ['Antioxidants'],
    },
    'Adrak Chiya': {
      ingredients: ['Ginger', 'Milk', 'Tea leaves'],
      healthBenefits: ['Soothes throat', 'Reduces fever'],
    },
    'Elaichi Chiya': {
      ingredients: ['Cardamom', 'Milk', 'Tea leaves'],
      healthBenefits: ['Improves digestion'],
    },
    'Ilam Gold': {
      ingredients: ['High-grade tea leaves'],
      healthBenefits: ['Rich flavor', 'Aroma'],
    },
    'Himalayan Green': {
      ingredients: ['Green tea'],
      healthBenefits: ['Detox', 'Metabolism'],
    },
    'Silver Tips': {
      ingredients: ['Buds only'],
      healthBenefits: ['Light and aromatic'],
    },
    'Tulsi Tea': {
      ingredients: ['Tulsi (holy basil)', 'Honey (optional)'],
      healthBenefits: ['Relief for cold and cough'],
    },
    'Nettle Tea': {
      ingredients: ['Nettle leaves'],
      healthBenefits: ['Mineral-rich'],
    },
    'Lemon Grass': {
      ingredients: ['Lemongrass', 'Honey (optional)'],
      healthBenefits: ['Aromatic, calming'],
    },
  }
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState<string>('')
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
  const sectionId = (k: string) => `menu-${k}`

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/menu`)
        const data = await res.json()
        if (!res.ok) throw new Error((data && (data as { message?: string }).message) || t('menu.error.fetch'))
        if (Array.isArray(data?.categories) && !cancelled) {
          setCategories(data.categories)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : t('menu.error.load')
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [apiBase, t])

  // Scrollspy to highlight the active category in side rail and chips
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: '-120px 0px -70% 0px',
      threshold: 0.1,
    }
    const handler = (entries: IntersectionObserverEntry[]) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? -1 : 1))
      if (visible[0]?.target?.id) {
        const id = visible[0].target.id
        const key = id.replace(/^menu-/, '')
        setActiveKey(key)
      }
    }
    categories.forEach((cat) => {
      const el = document.getElementById(sectionId(cat.key))
      if (!el) return
      const obs = new IntersectionObserver(handler, opts)
      obs.observe(el)
      observers.push(obs)
    })
    return () => {
      observers.forEach((o) => o.disconnect())
    }
  }, [categories])

  return (
    <>
    <Meta title={t('meta.menu.title')} description={t('meta.menu.desc')} url={url} image={og} locale={ogLocale} />
    <main className="max-w-6xl mx-auto px-4 py-10 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Header */}
      <header className="mb-6 lg:mb-8 lg:col-span-12">
        <h1 className="text-3xl font-bold tracking-tight">{t('menu.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{t('menu.subtitle')}</p>
        <div className="mt-3 text-xs text-gray-500">
          <span className="mr-2">{t('menu.legend')}</span>
          <span className="mr-2">{t('menu.legend.brew')}</span>
          <span>{t('menu.legend.seasonal')}</span>
        </div>
        {loading && <p className="mt-2 text-xs text-gray-500">{t('menu.loading')}</p>}
        {error && (
          <div className="mt-3 text-sm rounded-md px-3 py-2 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        )}

        {/* Mobile: horizontal category chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
          {categories.map((cat) => (
            <a
              key={cat.key}
              href={`#${sectionId(cat.key)}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(sectionId(cat.key))
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={
                'whitespace-nowrap rounded-full border px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900 ' +
                (activeKey === cat.key
                  ? 'border-[--color-accent] text-[--color-accent] bg-amber-50 dark:bg-amber-500/10'
                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[--color-accent]')
              }
            >
              {cat.titleNepali}
            </a>
          ))}
        </div>
      </header>

      {/* Desktop: sticky side rail */}
      <aside className="hidden lg:block lg:col-span-3 self-start sticky top-24">
        <nav className="space-y-1">
          {categories.map((cat) => (
            <a
              key={cat.key}
              href={`#${sectionId(cat.key)}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(sectionId(cat.key))
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={
                'block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900 ' +
                (activeKey === cat.key
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60')
              }
            >
              <div className="font-medium">{cat.titleNepali}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{cat.titleEnglish}</div>
            </a>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="lg:col-span-9">
        {categories.map((cat) => (
          <section key={cat.key} id={sectionId(cat.key)} className="mb-10 scroll-mt-24">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">{cat.titleNepali}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{cat.titleEnglish}</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cat.teas.map((t) => {
                const titleKey = t.titleEnglish || ''
                const override = locale === 'en' && titleKey ? fallbackEnglishDetail[titleKey] : undefined
                return (
                  <TeaCard
                    key={t.titleEnglish}
                    {...t}
                    ingredients={override?.ingredients ?? t.ingredients}
                    healthBenefits={override?.healthBenefits ?? t.healthBenefits}
                  />
                )
              })}
            </div>
          </section>
        ))}

        {/* Cultural brewing instructions & health notes */}
        <section className="mt-6 grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-[--color-surface] dark:bg-gray-900"
          >
            <h3 className="font-semibold mb-2">{t('menu.tips.title')}</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>{t('menu.tips.item.dudh')}</li>
              <li>{t('menu.tips.item.kalo')}</li>
              <li>{t('menu.tips.item.masala')}</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-[--color-surface] dark:bg-gray-900"
          >
            <h3 className="font-semibold mb-2">{t('menu.health.title')}</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>{t('menu.health.item.green')}</li>
              <li>{t('menu.health.item.tulsi')}</li>
              <li>{t('menu.health.item.black')}</li>
            </ul>
          </motion.div>
        </section>
      </div>
    </main>
    </>
  )
}
