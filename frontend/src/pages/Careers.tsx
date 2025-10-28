import Meta from '../components/Meta'
import Breadcrumbs from '../components/Breadcrumbs'
import { useI18n } from '../i18n/I18nProvider'
import { motion } from 'framer-motion'
import { FormField } from '../components/ui/FormField'
import Label from '../components/ui/Label'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import StructuredData from '../components/StructuredData'

export default function Careers() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  return (
    <>
      <Meta title={(t('nav.careers') || 'Careers') + ' | ' + t('brand')} description={t('meta.careers.desc') || 'Work with us at Hamro Chiya Pasal.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('brand'), item: `${origin}/${locale}/` },
            { '@type': 'ListItem', position: 2, name: t('nav.careers') || 'Careers', item: `${origin}/${locale}/careers` },
          ],
        }}
      />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('nav.careers') || 'Careers', href: `/${locale}/careers` }]} />
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">{t('nav.careers') || 'Careers'}</motion.h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{t('careers.subtitle') || 'Join our team and help serve authentic Nepali tea with warmth and pride.'}</p>
        <form className="space-y-4">
          <FormField>
            <Label htmlFor="name">{t('form.name') || 'Name'}</Label>
            <Input id="name" name="name" autoComplete="name" required />
          </FormField>
          <FormField>
            <Label htmlFor="email">{t('form.email') || 'Email'}</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </FormField>
          <FormField>
            <Label htmlFor="role">{t('careers.role') || 'Role of interest'}</Label>
            <Input id="role" name="role" />
          </FormField>
          <FormField>
            <Label htmlFor="message">{t('form.message') || 'Message'}</Label>
            <Textarea id="message" name="message" rows={5} />
          </FormField>
          <Button type="submit">{t('common.submit') || 'Submit'}</Button>
        </form>
      </main>
    </>
  )
}
