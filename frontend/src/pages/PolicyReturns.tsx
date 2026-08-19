import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'

export default function PolicyReturns() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Meta title={t('policy.returns.title') || 'Returns & Refunds'} description={t('policy.returns.desc') || 'Our returns and refunds policy.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <h1 className="text-3xl font-semibold mb-4">Returns & Refunds</h1>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>We accept returns within 7 days of delivery for unused products in original packaging. To start a return, email <a href="mailto:returns@hamrochiya.com">returns@hamrochiya.com</a> with your order number and reason for return.</p>
        <p>Return shipping costs are the responsibility of the customer unless the item was defective or incorrectly shipped. Refunds are issued to the original payment method within 5 to 10 business days after we receive the returned item. Perishable items and opened food packaging are final sale and not eligible for return unless damaged on arrival.</p>
      </div>
    </main>
  )
}
