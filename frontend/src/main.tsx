import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from './i18n/I18nProvider'
import { captureFromURL, getCampaignData } from './utils/campaign'

// Capture UTM/campaign params and send a one-time beacon
try {
  captureFromURL()
  const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
  const apiBase = env?.VITE_API_BASE_URL ?? 'http://localhost:5000'
  const payload = {
    ...getCampaignData(),
    ref: typeof document !== 'undefined' ? document.referrer : undefined,
  }
  // Fire-and-forget; ignore errors
  fetch(`${apiBase}/api/social/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => { /* ignore */ })
} catch {
  // ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
