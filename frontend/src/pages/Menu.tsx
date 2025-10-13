import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Meta from '../components/Meta'
import StructuredData from '../components/StructuredData'
import TeaCard from '../components/TeaCard'
import { useI18n } from '../i18n/I18nProvider'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkeletonBlock, SkeletonText } from '../components/Skeleton'

type Tea = {
  titleNepali: string
  titleEnglish: string
  priceNpr: number
  imageUrl?: string
  ingredients?: string[]
  healthBenefits?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  seasonal?: boolean
  available?: boolean
  popularity?: number
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
  const location = useLocation()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  // Initialize search query from URL params once
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qp = (params.get('q') || '').trim()
    if (qp) setQ(qp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
  const [allCategories, setAllCategories] = useState<Category[]>(fallbackCategories)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState<string>('')
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
  const pollMs = Number((import.meta as unknown as { env?: { VITE_MENU_POLL_MS?: string } }).env?.VITE_MENU_POLL_MS ?? '0')
  const sectionId = (k: string) => `menu-${k}`
  // Search & filter state
  const [q, setQ] = useState('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false)
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'popularity_desc' | 'name_asc'>('name_asc')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/menu`)
        const data = await res.json()
        if (!res.ok) throw new Error((data && (data as { message?: string }).message) || t('menu.error.fetch'))
        if (Array.isArray(data?.categories) && !cancelled) {
          setCategories(data.categories)
          setAllCategories(data.categories)
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

  // Debounced search with filters
  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      try {
        // If no filters applied, show original categories
        const noFilters = !q && !minPrice && !maxPrice && !selectedCategory && !onlyAvailable && sort === 'name_asc'
        if (noFilters) {
          if (!cancelled) setCategories(allCategories)
          return
        }
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (minPrice) params.set('minPrice', String(Number(minPrice) || ''))
        if (maxPrice) params.set('maxPrice', String(Number(maxPrice) || ''))
        if (selectedCategory) params.set('category', selectedCategory)
        if (onlyAvailable) params.set('available', 'true')
        if (sort) params.set('sort', sort)
        const res = await fetch(`${apiBase}/api/menu/search?${params.toString()}`, { signal: ctrl.signal })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || t('menu.error.fetch'))
        if (Array.isArray(data?.categories) && !cancelled) {
          setCategories(data.categories)
        }
      } catch (err) {
        if (!cancelled && (err as Error).name !== 'AbortError') {
          // keep previous results, but we could surface an inline error
        }
      }
    }, 250)
    return () => {
      cancelled = true
      ctrl.abort()
      clearTimeout(timer)
    }
  }, [q, minPrice, maxPrice, selectedCategory, onlyAvailable, sort, apiBase, t, allCategories])

  // Live polling for price/availability. If filters are active, poll the search endpoint with same params; otherwise poll base list.
  useEffect(() => {
    if (!pollMs || pollMs < 10000) return // require at least 10s to avoid excessive polling
    let cancelled = false
    const timer = setInterval(async () => {
      try {
        const hasFilters = !!(q || minPrice || maxPrice || selectedCategory || onlyAvailable || sort !== 'name_asc')
        let url = `${apiBase}/api/menu`
        if (hasFilters) {
          const params = new URLSearchParams()
          if (q) params.set('q', q)
          if (minPrice) params.set('minPrice', String(Number(minPrice) || ''))
          if (maxPrice) params.set('maxPrice', String(Number(maxPrice) || ''))
          if (selectedCategory) params.set('category', selectedCategory)
          if (onlyAvailable) params.set('available', 'true')
          if (sort) params.set('sort', sort)
          url = `${apiBase}/api/menu/search?${params.toString()}`
        }
        const res = await fetch(url)
        const data = await res.json()
        if (!cancelled && Array.isArray(data?.categories)) {
          if (hasFilters) {
            setCategories(data.categories)
          } else {
            setCategories(data.categories)
            setAllCategories(data.categories)
          }
        }
      } catch {
        // ignore transient polling errors
      }
    }, pollMs)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [pollMs, apiBase, q, minPrice, maxPrice, selectedCategory, onlyAvailable, sort])
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
    <Meta title={t('meta.menu.title')} description={t('meta.menu.desc')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
    <StructuredData
      json={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('brand'), item: `${origin}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: t('nav.menu'), item: `${origin}/${locale}/menu` },
        ],
      }}
    />
    <StructuredData
      json={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: categories.flatMap((cat, cIdx) =>
          cat.teas.map((tea, tIdx) => ({
            '@type': 'ListItem',
            position: cIdx * 100 + tIdx + 1,
            item: {
              '@type': 'Product',
              name: locale === 'ne' ? tea.titleNepali : tea.titleEnglish,
              ...(tea.imageUrl ? { image: tea.imageUrl } : {}),
              brand: { '@type': 'Brand', name: 'Hamro Chiya Pasal' },
              offers: {
                '@type': 'Offer',
                price: tea.priceNpr,
                priceCurrency: 'NPR',
                availability: 'https://schema.org/InStoreOnly',
                url,
              },
            },
          }))
        ),
      }}
    />
    <main className="max-w-6xl mx-auto px-4 py-10 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Header */}
      <header className="mb-6 lg:mb-8 lg:col-span-12">
        <Breadcrumbs
          items={[
            { label: t('brand'), href: `/${locale}/` },
            { label: t('nav.menu'), href: `/${locale}/menu` },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{t('menu.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{t('menu.subtitle')}</p>
        <div className="mt-3 text-xs text-gray-500">
          <span className="mr-2">{t('menu.legend')}</span>
          <span className="mr-2">{t('menu.legend.brew')}</span>
          <span>{t('menu.legend.seasonal')}</span>
        </div>
        {loading && (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                <SkeletonBlock className="h-40 w-full mb-3" />
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="mt-3 text-sm rounded-md px-3 py-2 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        )}

        {/* Search and filters */}
        <div className="mt-4 grid md:grid-cols-4 gap-3">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('menu.search.placeholder')}
            className="border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder={t('menu.search.minPrice')}
              className="w-full border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            />
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={t('menu.search.maxPrice')}
              className="w-full border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          >
            <option value="">{t('menu.search.allCategories')}</option>
            {allCategories.map((c) => (
              <option key={c.key} value={c.key}>{c.titleNepali}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
              {t('menu.search.onlyAvailable')}
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border rounded px-2 py-1 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
            >
              <option value="name_asc">{t('menu.sort.name')}</option>
              <option value="price_asc">{t('menu.sort.priceAsc')}</option>
              <option value="price_desc">{t('menu.sort.priceDesc')}</option>
              <option value="popularity_desc">{t('menu.sort.popularity')}</option>
            </select>
          </div>
        </div>

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
                  ? 'bg-[--color-surface] text-[--color-primary] dark:text-[--color-accent] border border-[--color-primary]/30'
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
                    available={t.available ?? true}
                    highlight={q}
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
