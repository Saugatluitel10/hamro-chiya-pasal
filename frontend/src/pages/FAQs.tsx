import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import { motion } from 'framer-motion'
import StructuredData from '../components/StructuredData'

const faqs = [
  { q: 'What makes your tea authentic?', a: 'We source from Nepali regions like Ilam and brew using traditional methods with fresh spices.' },
  { q: 'Do you offer dairy-free options?', a: 'Yes. We can make teas with plant-based milk on request.' },
  { q: 'Where are you located?', a: 'Thamel, Kathmandu with pop-ups around the valley. See Visit page for details.' },
]

export default function FAQs() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  return (
    <>
      <Meta title={(t('nav.faqs') || 'FAQs') + ' | ' + t('brand')} description={t('meta.faqs.desc') || 'Frequently asked questions about Hamro Chiya Pasal.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('brand'), item: `${origin}/${locale}/` },
            { '@type': 'ListItem', position: 2, name: t('nav.faqs') || 'FAQs', item: `${origin}/${locale}/faqs` },
          ],
        }}
      />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('nav.faqs') || 'FAQs', href: `/${locale}/faqs` }]} />
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-4">{t('nav.faqs') || 'FAQs'}</motion.h1>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{f.a}</p>
            </details>
          ))}
        </div>
      </main>
    </>
  )
}
