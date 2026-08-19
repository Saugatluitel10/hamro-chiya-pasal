import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'

export default function PolicyTerms() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Meta title={t('policy.terms.title') || 'Terms & Conditions'} description={t('policy.terms.desc') || 'Our terms and conditions.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <h1 className="text-3xl font-semibold mb-4">Terms & Conditions</h1>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>By using this website you agree to our terms. Orders are subject to availability. Prices and product information may change without notice. We make reasonable efforts to ensure product descriptions are accurate. We are not liable for delays caused by third party couriers. For full terms and conditions, contact <a href="mailto:legal@hamrochiya.com">legal@hamrochiya.com</a>.</p>
      </div>
    </main>
  )
}
