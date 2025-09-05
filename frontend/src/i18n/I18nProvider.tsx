import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Locale = 'ne' | 'en'

type Messages = Record<string, string>

type I18nContextType = {
  locale: Locale
  t: (key: string) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const DEFAULT_LOCALE: Locale = 'ne'

function detectInitialLocale(): Locale {
  const saved = localStorage.getItem('locale') as Locale | null
  if (saved === 'ne' || saved === 'en') return saved
  const nav = navigator?.language?.toLowerCase() || 'ne'
  if (nav.startsWith('ne')) return 'ne'
  return 'en'
}

async function loadMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case 'en':
      return (await import('./messages/en.json')).default as Messages
    case 'ne':
    default:
      return (await import('./messages/ne.json')).default as Messages
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale())
  const [messages, setMessages] = useState<Messages>({})

  useEffect(() => {
    let cancelled = false
    loadMessages(locale).then((msgs) => {
      if (!cancelled) setMessages(msgs)
    })
    return () => {
      cancelled = true
    }
  }, [locale])

  // Keep the <html lang> attribute in sync with current locale for a11y/SEO
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale)
    }
  }, [locale])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }

  const t = useMemo(() => {
    return (key: string) => messages[key] ?? key
  }, [messages])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
