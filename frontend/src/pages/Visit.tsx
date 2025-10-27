import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import { motion } from 'framer-motion'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'

function LocationCard({ name, addr, hours, map }: { name: string; addr: string; hours: string; map: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{addr}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{hours}</p>
        <div className="mt-3">
          <a href={map} target="_blank" rel="noreferrer" className="btn-secondary">View on Map</a>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Visit() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  const locations = [
    { name: 'Thamel Tea Bar', addr: '23 Tea Street, Thamel, Kathmandu', hours: 'Mon–Sun: 7am – 8pm', map: 'https://maps.app.goo.gl/your-map-link-here' },
    { name: 'Patan Chiya Corner', addr: '12 Heritage Lane, Patan', hours: 'Mon–Sun: 8am – 7pm', map: 'https://maps.app.goo.gl/your-map-link-here' },
  ]

  return (
    <>
      <Meta title={(t('nav.visit') || 'Visit') + ' | ' + t('brand')} description={t('meta.visit.desc') || 'Find our cafés, hours, and directions.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('nav.visit') || 'Visit', href: `/${locale}/visit` }]} />

        <section>
          <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">
            {t('nav.visit') || 'Visit'}
          </motion.h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{t('visit.subtitle') || 'Stop by our cafés for authentic Nepali tea, light bites, and warm hospitality.'}</p>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-8">
          {locations.map((l) => (
            <LocationCard key={l.name} {...l} />
          ))}
        </section>

        <section>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <iframe
              title="Hamro Chiya Pasal – Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.063985266002!2d85.310!3d27.716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzU3LjYiTiA4NcKwMTgnMzYuMCJF!5e0!3m2!1sen!2snp!4v00000000000"
              width="100%"
              height="380"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('common.backToTop') || 'Back to top'}</Button>
          </div>
        </section>
      </main>
    </>
  )
}
