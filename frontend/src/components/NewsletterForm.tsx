import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { getCampaignData } from '../utils/campaign'
import Input from './ui/Input'
import Button from './ui/Button'

export default function NewsletterForm() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [mode, setMode] = useState<'subscribe' | 'unsubscribe'>('subscribe')
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    window.dispatchEvent(
      new CustomEvent('app:toast', { detail: { message, type, durationMs: 3200 } })
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email)) {
      setStatus('error')
      toast('Invalid email', 'error')
      return
    }
    setStatus('loading')
    try {
      const path = mode === 'subscribe' ? 'subscribe' : 'unsubscribe'
      const res = await fetch(`${apiBase}/api/newsletter/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          campaign: getCampaignData(),
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Error')
      setStatus('success')
      toast(mode === 'subscribe' ? t('newsletter.success') : t('newsletter.unsubscribe.success'), 'success')
      setEmail('')
    } catch {
      setStatus('error')
      toast(mode === 'subscribe' ? t('newsletter.error') : t('newsletter.unsubscribe.error'), 'error')
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder.email')}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading'
            ? t('common.loading')
            : mode === 'subscribe'
            ? t('newsletter.submit')
            : t('newsletter.unsubscribe.submit')}
        </Button>
      </form>
      <div className="mt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'subscribe' ? 'unsubscribe' : 'subscribe'))
            setStatus('idle')
          }}
          className="text-xs text-[--color-primary] dark:text-[--color-accent] hover:underline"
        >
          {mode === 'subscribe' ? t('newsletter.switchToUnsubscribe') : t('newsletter.switchToSubscribe')}
        </button>
      </div>
    </div>
  )
}
