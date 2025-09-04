import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from './i18n/I18nProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
