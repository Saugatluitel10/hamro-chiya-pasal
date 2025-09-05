import { useI18n } from '../i18n/I18nProvider'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto py-8 text-center text-sm text-gray-500 dark:text-gray-400">
      © {year} {t('brand')} • {t('footer.location')}
    </footer>
  )
}
