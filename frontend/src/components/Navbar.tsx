import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import PatternBorder from './PatternBorder'

const base = 'text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900'
const active = 'text-emerald-700 dark:text-emerald-300'

export default function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const prefix = `/${locale}`
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navQuery, setNavQuery] = useState('')

  const switchLocale = (l: 'ne' | 'en') => {
    const rest = location.pathname.replace(/^\/(ne|en)(?=\/|$)/, '') || '/'
    setLocale(l)
    navigate(`/${l}${rest}`, { replace: true })
  }
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to={`${prefix}/`} className="font-semibold text-emerald-600 dark:text-emerald-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900">
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
            }}
            className="hidden lg:flex items-center"
          >
            <input
              type="search"
              value={navQuery}
              onChange={(e) => setNavQuery(e.target.value)}
              placeholder={t('menu.search.placeholder')}
              className="w-48 border rounded px-2 py-1 text-sm bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800 mr-2"
            />
          </form>
          <NavLink to={`${prefix}/menu`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.menu')}</NavLink>
          <NavLink to={`${prefix}/about`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.about')}</NavLink>
          <NavLink to={`${prefix}/contact`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.contact')}</NavLink>
          <NavLink to={`${prefix}/blog`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.blog')}</NavLink>
          <NavLink to={`${prefix}/gallery`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('gallery.title')}</NavLink>
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
              className={`text-xs px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900 ${locale === 'ne' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}
            >
              {t('lang.ne')}
            </button>
            <span className="text-gray-400 text-xs">|</span>
            <button
              type="button"
              onClick={() => switchLocale('en')}
              className={`text-xs px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900 ${locale === 'en' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}
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
              <input
                type="search"
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder={t('menu.search.placeholder')}
                className="flex-1 border rounded-l px-3 py-2 text-sm bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
              <button type="submit" className="px-3 py-2 border rounded-r border-gray-200 dark:border-gray-800">Search</button>
            </form>
            <div className="flex flex-col gap-2">
              <NavLink to={`${prefix}/menu`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.menu')}</NavLink>
              <NavLink to={`${prefix}/about`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.about')}</NavLink>
              <NavLink to={`${prefix}/contact`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.contact')}</NavLink>
              <NavLink to={`${prefix}/blog`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.blog')}</NavLink>
              <NavLink to={`${prefix}/gallery`} onClick={() => setMobileOpen(false)} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('gallery.title')}</NavLink>
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
                <button type="button" onClick={() => { switchLocale('ne'); setMobileOpen(false) }} className={`text-xs px-2 py-1 rounded ${locale === 'ne' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}>{t('lang.ne')}</button>
                <button type="button" onClick={() => { switchLocale('en'); setMobileOpen(false) }} className={`text-xs px-2 py-1 rounded ${locale === 'en' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'}`}>{t('lang.en')}</button>
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
