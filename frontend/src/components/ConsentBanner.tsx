import { useEffect, useState } from 'react'
import Button from './ui/Button'

function getStored(): 'granted' | 'denied' | null {
  try {
    const v = localStorage.getItem('consent.analytics')
    if (v === 'granted' || v === 'denied') return v
  } catch {}
  return null
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const v = getStored()
    if (!v) setVisible(true)
  }, [])

  function setConsent(v: 'granted' | 'denied') {
    try { localStorage.setItem('consent.analytics', v) } catch {}
    window.dispatchEvent(new CustomEvent('consent:changed'))
    setVisible(false)
  }

  if (!visible) return null
  return (
    <div className="fixed bottom-3 left-3 right-3 md:left-6 md:right-auto md:max-w-xl z-50">
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-[--color-surface] dark:bg-gray-900 shadow p-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          We use minimal analytics (GA4) to improve experience. No ads personalization. Do you allow anonymous usage analytics?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" onClick={() => setConsent('granted')}>Allow</Button>
          <Button size="sm" variant="secondary" onClick={() => setConsent('denied')}>Decline</Button>
        </div>
      </div>
    </div>
  )
}
