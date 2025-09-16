import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import PatternBorder from './PatternBorder'

const base = 'text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900'
const active = 'text-emerald-700 dark:text-emerald-300'

export default function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const prefix = `/${locale}`

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
        <div className="flex items-center gap-5">
          <NavLink to={`${prefix}/menu`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.menu')}</NavLink>
          <NavLink to={`${prefix}/about`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.about')}</NavLink>
          <NavLink to={`${prefix}/contact`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.contact')}</NavLink>
          <NavLink to={`${prefix}/blog`} className={({isActive}) => `${base} ${isActive ? active : ''}`}>{t('nav.blog')}</NavLink>
          <div className="flex items-center gap-1 ml-2" aria-label={t('toggle.language')}>
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
      </nav>
      {/* Subtle decorative border inspired by Nepali motifs */}
      <PatternBorder className="text-[--color-accent] opacity-80" />
    </header>
  )
}
