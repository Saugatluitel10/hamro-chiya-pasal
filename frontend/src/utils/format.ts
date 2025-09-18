export function formatNumber(value: number, locale: 'ne' | 'en' = 'ne', options?: Intl.NumberFormatOptions) {
  const loc = locale === 'ne' ? 'ne-NP' : 'en-US'
  return new Intl.NumberFormat(loc, options).format(value)
}

export function formatCurrencyNpr(value: number, locale: 'ne' | 'en' = 'ne') {
  // Show NPR without currency code, as UI already displays Rs.
  return formatNumber(value, locale, { maximumFractionDigits: 0 })
}

export function formatDate(date: Date | string, locale: 'ne' | 'en' = 'ne') {
  const d = typeof date === 'string' ? new Date(date) : date
  const loc = locale === 'ne' ? 'ne-NP' : 'en-US'
  return d.toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Preference helpers: allow forcing Nepali digits independent of language
export function preferNepaliDigits(): boolean {
  try {
    return localStorage.getItem('useNepaliNumerals') === 'true'
  } catch {
    return false
  }
}

export function formatCurrencyNprAuto(value: number, locale: 'ne' | 'en') {
  const useNe = preferNepaliDigits() || locale === 'ne'
  return formatCurrencyNpr(value, useNe ? 'ne' : 'en')
}

export function formatDateAuto(date: Date | string, locale: 'ne' | 'en') {
  const useNe = preferNepaliDigits() || locale === 'ne'
  return formatDate(date, useNe ? 'ne' : 'en')
}

export function formatNumberAuto(value: number, locale: 'ne' | 'en', options?: Intl.NumberFormatOptions) {
  const useNe = preferNepaliDigits() || locale === 'ne'
  return formatNumber(value, useNe ? 'ne' : 'en', options)
}
