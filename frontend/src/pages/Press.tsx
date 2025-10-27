import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import { motion } from 'framer-motion'

export default function Press() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  const items = [
    { outlet: 'Kathmandu Post', title: 'Nepali tea culture gets a modern reboot', href: '#' },
    { outlet: 'The Record', title: 'A cup of Himalaya: Ilam to Thamel', href: '#' },
    { outlet: 'Himal Southasian', title: 'The rise of the chai bar', href: '#' },
  ]

  return (
    <>
      <Meta title={(t('nav.press') || 'Press') + ' | ' + t('brand')} description={t('meta.press.desc') || 'Mentions and features from the press.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('nav.press') || 'Press', href: `/${locale}/press` }]} />
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-4">{t('nav.press') || 'Press'}</motion.h1>
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.title} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <div className="text-sm text-gray-500 mb-1">{it.outlet}</div>
              <a href={it.href} className="text-[--color-accent] hover:underline" target="_blank" rel="noreferrer">{it.title}</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
