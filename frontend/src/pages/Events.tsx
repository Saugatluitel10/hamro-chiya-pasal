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

export default function Events() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'

  return (
    <>
      <Meta title={(t('nav.events') || 'Events & Catering') + ' | ' + t('brand')} description={t('meta.events.desc') || 'Host your event with authentic Nepali tea and light bites.'} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
      <StructuredData
        json={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('brand'), item: `${origin}/${locale}/` },
            { '@type': 'ListItem', position: 2, name: t('nav.events') || 'Events & Catering', item: `${origin}/${locale}/events` },
          ],
        }}
      />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t('brand'), href: `/${locale}/` }, { label: t('nav.events') || 'Events', href: `/${locale}/events` }]} />
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-2">{t('nav.events') || 'Events & Catering'}</motion.h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{t('events.subtitle') || 'Chiya bar, tea tastings, and catering for gatherings large and small.'}</p>
        <form className="space-y-4">
          <FormField>
            <Label htmlFor="name">{t('form.name') || 'Name'}</Label>
            <Input id="name" name="name" required />
          </FormField>
          <FormField>
            <Label htmlFor="email">{t('form.email') || 'Email'}</Label>
            <Input id="email" name="email" type="email" required />
          </FormField>
          <FormField>
            <Label htmlFor="date">{t('events.date') || 'Date'}</Label>
            <Input id="date" name="date" type="date" />
          </FormField>
          <FormField>
            <Label htmlFor="size">{t('events.size') || 'Guest count'}</Label>
            <Input id="size" name="size" type="number" min={1} />
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
