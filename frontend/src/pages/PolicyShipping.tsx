import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'

export default function PolicyShipping() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Meta title={t('policy.shipping.title') || 'Shipping Policy'} description={t('policy.shipping.desc') || 'Our shipping timelines and rules.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <h1 className="text-3xl font-semibold mb-4">Shipping Policy</h1>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>We process orders Monday through Friday, excluding public holidays. Local delivery within Nepal typically takes 2 to 5 business days from the date of dispatch. Express delivery options may be available at checkout and will be shown with estimated delivery times and fees.</p>
        <p>International shipping is available to select countries; shipping times vary by destination. Shipping costs are calculated at checkout. If an order has not arrived within the estimated window, contact us at <a href="mailto:support@hamrochiya.com">support@hamrochiya.com</a> and include your order number. We will investigate and provide next steps.</p>
      </div>
    </main>
  )
}
