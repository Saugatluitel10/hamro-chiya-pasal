import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import PatternBorder from './PatternBorder'
import { useCart } from '../hooks/useCart'
import Input from './ui/Input'
import Button from './ui/Button'

const base = 'text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[--color-primary] dark:hover:text-[--color-accent] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900'
const active = 'text-[--color-primary] dark:text-[--color-accent]'

export default function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const prefix = `/${locale}`
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navQuery, setNavQuery] = useState('')
  const [openSuggest, setOpenSuggest] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const suggestRef = useRef<HTMLDivElement | null>(null)
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
  // Load menu titles once for suggestions
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/menu`, { headers: { 'Accept': 'application/json' } })
        const data = await res.json()
        if (!cancelled && Array.isArray(data?.categories)) {
          const titles: string[] = []
          for (const c of data.categories as Array<{ teas?: Array<{ titleEnglish?: string; titleNepali?: string }> }>) {
            for (const t of c.teas || []) {
              if (t.titleEnglish) titles.push(t.titleEnglish)
              if (t.titleNepali) titles.push(t.titleNepali)
            }
          }
          setSuggestions(Array.from(new Set(titles)))
        }
      } catch {
        // ignore for now; suggestions optional
      }
    }
    load()
    return () => { cancelled = true }
  }, [apiBase])
  const filtered = useMemo(() => {
    const q = navQuery.trim().toLowerCase()
    if (!q) return []
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6)
  }, [navQuery, suggestions])
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!suggestRef.current) return
      if (!suggestRef.current.contains(e.target as Node)) setOpenSuggest(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])
  const { items } = useCart()
  const cartCount = items.reduce((s, it) => s + it.qty, 0)

  const switchLocale = (l: 'ne' | 'en') => {
    const rest = location.pathname.replace(/^\/(ne|en)(?=\/|$)/, '') || '/'
    setLocale(l)
    navigate(`/${l}${rest}`, { replace: true })
  }
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to={`${prefix}/`} className="font-semibold text-[--color-primary] dark:text-[--color-accent] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900">
          {t('brand')}
        </NavLink>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const q = navQuery.trim()
              const url = q ? `${prefix}/menu?q=${encodeURIComponent(q)}` : `${prefix}/menu`
              navigate(url)
              setOpenSuggest(false)
            }}
            className="hidden lg:flex items-center relative"
          >
            <Input
              type="search"
              value={navQuery}
              onChange={(e) => { setNavQuery(e.target.value); setOpenSuggest(true) }}
              placeholder={t('menu.search.placeholder')}
              className="w-48 mr-2 text-sm py-1.5 px-2"
            />
            <Button type="submit" size="sm" className="text-sm">{t('common.search') || 'Search'}</Button>
            {openSuggest && filtered.length > 0 && (
              <div ref={suggestRef} className="absolute top-full left-0 mt-1 w-64 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow z-10">
                <ul className="py-1 text-sm">
                  {filtered.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => {
                          setNavQuery(s)
                          setOpenSuggest(false)
                          navigate(`${prefix}/menu?q=${encodeURIComponent(s)}`)
                        }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          <NavLink to={`${prefix}/menu`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.menu')}</NavLink>
          <NavLink to={`${prefix}/about`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.about')}</NavLink>
          <NavLink to={`${prefix}/visit`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.visit') || 'Visit'}</NavLink>
          <NavLink to={`${prefix}/events`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.events') || 'Events'}</NavLink>
          <NavLink to={`${prefix}/press`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.press') || 'Press'}</NavLink>
          <NavLink to={`${prefix}/careers`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.careers') || 'Careers'}</NavLink>
          <NavLink to={`${prefix}/gift-cards`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.giftcards') || 'Gift Cards'}</NavLink>
          <NavLink to={`${prefix}/faqs`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.faqs') || 'FAQs'}</NavLink>
          <NavLink to={`${prefix}/blog`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.blog') || 'Blog'}</NavLink>
          <NavLink to={`${prefix}/contact`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.contact')}</NavLink>
          {/* Simplify nav: hide blog/gallery in primary navbar for launch */}
          <NavLink to={`${prefix}/checkout`} className={({isActive}) => `${base} ${isActive ? active : ''} relative`}>🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-[--color-primary] text-white">{cartCount}</span>
            )}
          </NavLink>
          <Link to={`${prefix}/menu`} className="btn-primary text-xs">{t('cta.shopNow') || 'Shop Now'}</Link>
          <div className="flex items-center gap-3 ml-2" aria-label={t('toggle.language')}>
            <button
              type="button"
              onClick={() => {
                try {
                  const cur = localStorage.getItem('useNepaliNumerals') === 'true'
                  localStorage.setItem('useNepaliNumerals', String(!cur))
                  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: !cur ? t('toggle.numerals.on') : t('toggle.numerals.off'), type: 'success' } }))
                } catch {
                  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: t('toggle.numerals.error'), type: 'error' } }))
                }
              }}
              title={t('toggle.numerals.title')}
              className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-800"
            >
              १२३
            </button>
            <button
              type="button"
              onClick={() => switchLocale('ne')}
              className={`text-xs px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900 ${locale === 'ne' ? 'bg-[--color-surface] text-[--color-primary]' : 'text-gray-600 dark:text-gray-400 hover:text-[--color-primary]'}`}
            >
              {t('lang.ne')}
            </button>
            <span className="text-gray-400 text-xs">|</span>
            <button
              type="button"
              onClick={() => switchLocale('en')}
              className={`text-xs px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900 ${locale === 'en' ? 'bg-[--color-surface] text-[--color-primary]' : 'text-gray-600 dark:text-gray-400 hover:text-[--color-primary]'}`}
            >
              {t('lang.en')}
            </button>
          </div>
        </div>
        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent]"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </nav>
      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const q = navQuery.trim()
                const url = q ? `${prefix}/menu?q=${encodeURIComponent(q)}` : `${prefix}/menu`
                navigate(url)
                setMobileOpen(false)
              }}
              className="flex"
            >
              <Input
                type="search"
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder={t('menu.search.placeholder')}
                className="flex-1 rounded-l text-sm"
              />
              <Button type="submit" size="sm" className="rounded-r rounded-l-none">{t('common.search') || 'Search'}</Button>
            </form>
            <div className="flex flex-col gap-2">
              <NavLink to={`${prefix}/menu`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.menu')}</NavLink>
              <NavLink to={`${prefix}/about`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.about')}</NavLink>
              <NavLink to={`${prefix}/visit`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.visit') || 'Visit'}</NavLink>
              <NavLink to={`${prefix}/events`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.events') || 'Events'}</NavLink>
              <NavLink to={`${prefix}/press`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.press') || 'Press'}</NavLink>
              <NavLink to={`${prefix}/careers`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.careers') || 'Careers'}</NavLink>
              <NavLink to={`${prefix}/gift-cards`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.giftcards') || 'Gift Cards'}</NavLink>
              <NavLink to={`${prefix}/faqs`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.faqs') || 'FAQs'}</NavLink>
              <NavLink to={`${prefix}/blog`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.blog') || 'Blog'}</NavLink>
              <NavLink to={`${prefix}/contact`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.contact')}</NavLink>
              <NavLink to={`${prefix}/checkout`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''} relative`}>🛒
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-[--color-primary] text-white">{cartCount}</span>
                )}
              </NavLink>
              <Link to={`${prefix}/menu`} onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">{t('cta.shopNow') || 'Shop Now'}</Link>
              <div className="flex items-center gap-2 pt-2" aria-label={t('toggle.language')}>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const cur = localStorage.getItem('useNepaliNumerals') === 'true'
                      localStorage.setItem('useNepaliNumerals', String(!cur))
                      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: !cur ? t('toggle.numerals.on') : t('toggle.numerals.off'), type: 'success' } }))
                    } catch {
                      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: t('toggle.numerals.error'), type: 'error' } }))
                    }
                  }}
                  className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-800"
                >
                  १२३
                </button>
                <button type="button" onClick={() => { switchLocale('ne'); setMobileOpen(false) }} className={`text-xs px-2 py-1 rounded ${locale === 'ne' ? 'bg-[--color-surface] text-[--color-primary]' : 'text-gray-600 dark:text-gray-400 hover:text-[--color-primary]'}`}>{t('lang.ne')}</button>
                <button type="button" onClick={() => { switchLocale('en'); setMobileOpen(false) }} className={`text-xs px-2 py-1 rounded ${locale === 'en' ? 'bg-[--color-surface] text-[--color-primary]' : 'text-gray-600 dark:text-gray-400 hover:text-[--color-primary]'}`}>{t('lang.en')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Subtle decorative border inspired by Nepali motifs */}
      <PatternBorder className="text-[--color-accent] opacity-80" />
    </header>
  )
}
