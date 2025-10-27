import Meta from '../components/Meta'
import { useI18n } from '../i18n/I18nProvider'

export default function PolicyPrivacy() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Meta title={t('policy.privacy.title') || 'Privacy Policy'} description={t('policy.privacy.desc') || 'How we collect and use data.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <h1 className="text-3xl font-semibold mb-4">Privacy Policy</h1>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>We collect personal information necessary to process orders, provide customer service, and improve the shopping experience. This may include name, address, email, phone number, and payment details. We do not sell personal data to third parties. We use cookies and analytics to improve the site.</p>
        <p>Users may request access, correction, or deletion of their data by emailing <a href="mailto:privacy@hamrochiya.com">privacy@hamrochiya.com</a>. Full privacy policy and data retention details are available on this page.</p>
      </div>
    </main>
  )
}
