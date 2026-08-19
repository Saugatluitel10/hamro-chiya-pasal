import { useEffect } from 'react'

function loadGA(measurementId: string) {
  if (document.getElementById('ga4-base')) return
  const s1 = document.createElement('script')
  s1.id = 'ga4-base'
  s1.async = true
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(s1)

  const s2 = document.createElement('script')
  s2.id = 'ga4-config'
  s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { anonymize_ip: true });
  `
  document.head.appendChild(s2)
}

export default function Analytics() {
  useEffect(() => {
    const env = (import.meta as unknown as { env?: { VITE_GA_MEASUREMENT_ID?: string } }).env
    const id = env?.VITE_GA_MEASUREMENT_ID
    const getConsent = () => {
      try { return localStorage.getItem('consent.analytics') === 'granted' } catch { return false }
    }
    if (id && getConsent()) loadGA(id)

    function onConsentChange() {
      if (!id) return
      if (getConsent()) loadGA(id)
    }
    window.addEventListener('consent:changed', onConsentChange)
    return () => window.removeEventListener('consent:changed', onConsentChange)
  }, [])
  return null
}
