import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { getCampaignData } from '../utils/campaign'
import Label from './ui/Label'
import Input from './ui/Input'
import Button from './ui/Button'
import { FormField } from './ui/FormField'

export default function UGCForm() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [consent, setConsent] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!handle && !postUrl) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch(`${apiBase}/api/social/ugc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle, postUrl, consent, campaign: getCampaignData(), referrer: typeof document !== 'undefined' ? document.referrer : undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Fail')
      setStatus('success')
      setName(''); setHandle(''); setPostUrl('')
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: t('ugc.success'), type: 'success' } }))
    } catch {
      setStatus('error')
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: t('ugc.error'), type: 'error' } }))
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField>
          <Label htmlFor="ugc-name">{t('ugc.name')}</Label>
          <Input id="ugc-name" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="ugc-handle">{t('ugc.handle')}</Label>
          <Input id="ugc-handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
        </FormField>
      </div>
      <FormField>
        <Label htmlFor="ugc-post">{t('ugc.postUrl')}</Label>
        <Input id="ugc-post" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
      </FormField>
      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        {t('ugc.consent')}
      </label>
      <div className="flex gap-2 items-center">
        <Button type="submit" size="sm" disabled={status==='loading'}>
          {status==='loading' ? t('common.loading') : t('ugc.submit')}
        </Button>
        <span className="text-xs text-gray-600 dark:text-gray-400">{t('ugc.note')}</span>
      </div>
    </form>
  )
}
