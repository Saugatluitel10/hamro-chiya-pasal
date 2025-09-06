import { useI18n } from '../i18n/I18nProvider'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto py-8 text-center text-sm text-gray-600 dark:text-gray-400 footer-texture border-t border-gray-200 dark:border-gray-800">
      © {year} {t('brand')} • {t('footer.location')}
    </footer>
  )
}
