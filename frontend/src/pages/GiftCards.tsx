import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import { motion } from 'framer-motion'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function GiftCards() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  return (
    <>
      <Meta title={(t('nav.giftcards') || 'Gift Cards') + ' | ' + t('brand')} description={t('meta.giftcards.desc') || 'Share the taste of authentic Nepali tea with digital gift cards.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('nav.giftcards') || 'Gift Cards', href: `/${locale}/gift-cards` }]} />
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-4">{t('nav.giftcards') || 'Gift Cards'}</motion.h1>
        <div className="grid md:grid-cols-2 gap-4">
          {[{amount:25},{amount:50},{amount:100},{amount:150}].map(({amount}) => (
            <Card key={amount}>
              <CardHeader>
                <CardTitle>{t('gift.amount') || `NPR ${amount} Gift Card`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{t('gift.desc') || 'A digital gift card delivered by email with simple instructions.'}</p>
                <Button>{t('common.buyNow') || 'Buy Now'}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
