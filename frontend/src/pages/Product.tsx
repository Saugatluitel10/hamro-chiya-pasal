import { useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import Card, { CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Product() {
  const { slug } = useParams()
  const { t, locale } = useI18n()

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  // Placeholder data (to be replaced with real data fetch in later phase)
  const title = (slug || '').replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) || t('product.titleFallback')
  const price = 'Rs. 250'

  return (
    <>
      <Meta
        title={`${title} | ${t('brand')}`}
        description={t('meta.product.desc') || `${title} — authentic Nepali tea from Hamro Chiya Pasal. Order online.`}
        url={url}
        image={og}
        locale={ogLocale}
        localizedUrlStrategy="prefix"
      />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { label: t('brand'), href: `/${locale}/` },
            { label: t('nav.menu'), href: `/${locale}/menu` },
            { label: title, href: `/${locale}/product/${slug}` },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-4">
          <section>
            <div className="aspect-square rounded-lg bg-[--color-surface] dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t('product.sampleDescription')}</p>
                <p className="text-xl font-semibold">{price}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-3">
                <Button>{t('product.addToCart')}</Button>
                <Button variant="secondary">{t('product.buyNow')}</Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </>
  )
}
