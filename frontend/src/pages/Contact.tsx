import { motion } from 'framer-motion'
import { useState } from 'react'
import type React from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Meta from '../components/Meta'
import IconTeaLeaf from '../components/IconTeaLeaf'
import PatternBorder from '../components/PatternBorder'
import PrayerFlags from '../components/PrayerFlags'
import IconKettle from '../components/IconKettle'
import Breadcrumbs from '../components/Breadcrumbs'
import GoogleSignIn from '../components/GoogleSignIn'
import Label from '../components/ui/Label'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import { FormField, HelpText } from '../components/ui/FormField'

type MessageType = 'inquiry' | 'feedback' | 'catering'
type PreferredContact = 'email' | 'phone' | 'whatsapp'

export default function Contact() {
  const { t, locale } = useI18n()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const og = `${origin}/og/og-default.svg`
  const ogLocale = locale === 'ne' ? 'ne_NP' : 'en_US'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [messageType, setMessageType] = useState<MessageType>('inquiry')
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('email')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)
  // Honeypot field (should remain empty). Bots often fill hidden inputs.
  const [hp, setHp] = useState('')

  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)

    if (!name || (!email && !phone)) {
      setResult({ ok: false, msg: t('contact.form.validation.nameContactRequired') })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, messageType, preferredContact, message, hp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || t('contact.form.error.server'))
      setResult({ ok: true, msg: data?.message || t('contact.form.success') })
      setName(''); setEmail(''); setPhone(''); setMessage('')
      setMessageType('inquiry'); setPreferredContact('email')
      setHp('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('contact.form.error.server')
      setResult({ ok: false, msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
    <Meta title={t('meta.contact.title')} description={t('meta.contact.desc')} url={url} image={og} locale={ogLocale} localizedUrlStrategy="prefix" />
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs
        items={[
          { label: t('brand'), href: `/${locale}/` },
          { label: t('nav.contact'), href: `/${locale}/contact` },
        ]}
      />
      {/* Subtle cultural banner */}
      <div className="relative h-8 mb-1">
        <div className="absolute inset-0">
          <PrayerFlags className="opacity-70" height={36} />
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-2 flex items-center gap-2"
      >
        <IconTeaLeaf className="text-[--color-secondary]" />
        <span>{t('contact.title')}</span>
      </motion.h1>
      <PatternBorder className="text-[--color-accent] mb-4" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Location + Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t('contact.location.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('contact.location.addr')}</p>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-[--color-surface] dark:bg-gray-900">
            <iframe
              title={t('contact.map.title')}
              className="w-full aspect-video"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(t('contact.location.addr'))}&output=embed`}
            />
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <h3 className="font-semibold mb-1">{t('contact.landmarks.title')}</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                <li>{t('contact.landmarks.item.thamel')}</li>
                <li>{t('contact.landmarks.item.garden')}</li>
                <li>{t('contact.landmarks.item.kanti')}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
              <h3 className="font-semibold mb-1">{t('contact.access.title')}</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                <li>{t('contact.access.item.parking')}</li>
                <li>{t('contact.access.item.public')}</li>
                <li>{t('contact.access.item.ride')}</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
            <h3 className="font-semibold mb-1">{t('contact.hours.title')}</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-y-1">
              <li>{t('contact.hours.daysSunThu')}</li>
              <li>{t('contact.hours.fri')}</li>
              <li>{t('contact.hours.sat')}</li>
              <li>{t('contact.hours.holidays')}</li>
            </ul>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {t('contact.hours.note')}
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-[--color-surface] dark:bg-gray-900">
            <h3 className="font-semibold mb-1">{t('contact.info.title')}</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>{t('contact.info.phone')}</li>
              <li>{t('contact.info.whatsapp')}</li>
              <li>{t('contact.info.email')}</li>
              <li>{t('contact.info.socials')}</li>
            </ul>
          </div>
        </section>

        {/* Right: Form */}
        <section>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <IconKettle className="text-[--color-primary]" />
            <span>{t('contact.form.title')}</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('contact.form.subtitle')}</p>

          <div className="mb-4">
            <GoogleSignIn
              onSuccess={(data) => {
                try {
                  localStorage.setItem('AUTH_TOKEN', data.token)
                  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Signed in with Google', type: 'success' } }))
                } catch {
                  // ignore storage errors
                }
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="name">{t('contact.form.label.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('contact.form.placeholder.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <Label htmlFor="email">{t('contact.form.label.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('contact.form.placeholder.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <HelpText>{t('contact.form.help.email')}</HelpText>
              </FormField>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="phone">{t('contact.form.label.phone')}</Label>
                <Input
                  id="phone"
                  placeholder={t('contact.form.placeholder.phone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormField>
              <FormField>
                <Label htmlFor="type">{t('contact.form.label.type')}</Label>
                <Select
                  id="type"
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as MessageType)}
                >
                  <option value="inquiry">{t('contact.form.type.inquiry')}</option>
                  <option value="feedback">{t('contact.form.type.feedback')}</option>
                  <option value="catering">{t('contact.form.type.catering')}</option>
                </Select>
              </FormField>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="pref">{t('contact.form.label.pref')}</Label>
                <Select
                  id="pref"
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value as PreferredContact)}
                >
                  <option value="email">{t('contact.form.pref.email')}</option>
                  <option value="phone">{t('contact.form.pref.phone')}</option>
                  <option value="whatsapp">{t('contact.form.pref.whatsapp')}</option>
                </Select>
              </FormField>
            </div>
            <FormField>
              <Label htmlFor="message">{t('contact.form.label.message')}</Label>
              <Textarea
                id="message"
                rows={6}
                placeholder={t('contact.form.placeholder.message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormField>
            {/* Honeypot: visually hidden text field to trap bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
              <label htmlFor="hp" className="sr-only">{t('contact.form.hpLabel')}</label>
              <input
                id="hp"
                name="hp"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? t('contact.form.submit.sending') : t('contact.form.submit.label')}
              </Button>
              <span className="text-xs text-gray-600 dark:text-gray-400">{t('contact.form.privacy')}</span>
            </div>

            {result && (
              <div
                className={
                  'text-sm rounded-md px-3 py-2 ' +
                  (result.ok
                    ? 'bg-[--color-surface] text-[--color-primary] dark:text-[--color-accent]'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200')
                }
              >
                {result.msg}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
    </>
  )
}
