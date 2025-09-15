import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'

export default function NotFound() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  return (
    <>
    <Meta title={t('meta.notfound.title')} description={t('meta.notfound.desc')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
    <main className="min-h-[60vh] grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('notfound.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('notfound.message')}</p>
        <Link
          to={`/${locale}/`}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-offset-gray-900"
        >
          {t('notfound.cta.home')}
        </Link>
      </div>
    </main>
    </>
  )
}
