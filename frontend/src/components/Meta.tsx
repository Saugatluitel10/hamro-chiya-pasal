import { useEffect } from 'react'

export type MetaProps = {
  title?: string
  description?: string
  url?: string
  image?: string
  locale?: string
  // Optional explicit alternates map; if provided, overrides computed behavior
  alternates?: Partial<Record<'ne' | 'en' | 'x-default', string>>
  // Strategy for computing alternate URLs when alternates are not provided
  // 'same-path': both hreflang URLs point to the same route (default)
  // 'prefix': compute /ne and /en prefixed URLs based on current route
  localizedUrlStrategy?: 'same-path' | 'prefix'
}

// Lightweight per-route meta manager. No external deps.
export default function Meta({ title, description, url, image, locale, alternates, localizedUrlStrategy = 'prefix' }: MetaProps) {
  useEffect(() => {
    if (title) document.title = title
    const ensureMeta = (selector: string, attr: 'content' | 'href', value: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)
      if (!el) {
        if (selector.startsWith('meta[')) {
          el = document.createElement('meta') as HTMLMetaElement
          // Parse name/property from selector like meta[name="description"]
          const match = selector.match(/meta\[(name|property)="([^"]+)"\]/)
          if (match) (el as HTMLMetaElement).setAttribute(match[1], match[2])
          document.head.appendChild(el)
        } else if (selector.startsWith('link[')) {
          el = document.createElement('link') as HTMLLinkElement
          const match = selector.match(/link\[(rel)="([^"]+)"\]/)
          if (match) (el as HTMLLinkElement).setAttribute(match[1], match[2])
          document.head.appendChild(el)
        }
      }
      if (el) el.setAttribute(attr, value)
    }

    const ensureHreflang = (lang: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'alternate')
        el.setAttribute('hreflang', lang)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    if (description) ensureMeta('meta[name="description"]', 'content', description)
    if (url) {
      ensureMeta('meta[property="og:url"]', 'content', url)
      ensureMeta('link[rel="canonical"]', 'href', url)
      // Defaults
      ensureMeta('meta[property="og:type"]', 'content', 'website')
      try {
        const u = new URL(url)
        const host = u.host.replace(/^www\./, '')
        ensureMeta('meta[property="og:site_name"]', 'content', host)
      } catch {
        // ignore
      }
      // Provide per-route hreflang alternates
      if (alternates && (alternates.ne || alternates.en || alternates['x-default'])) {
        if (alternates.ne) ensureHreflang('ne', alternates.ne)
        if (alternates.en) ensureHreflang('en', alternates.en)
        if (alternates['x-default']) ensureHreflang('x-default', alternates['x-default'])
      } else if (localizedUrlStrategy === 'prefix') {
        try {
          const u = new URL(url)
          const origin = `${u.protocol}//${u.host}`
          const rest = u.pathname.replace(/^\/(ne|en)(?=\/|$)/, '').replace(/^\/?/, '/')
          const neUrl = `${origin}/ne${rest}`
          const enUrl = `${origin}/en${rest}`
          const xDefault = `${origin}${rest}`
          ensureHreflang('ne', neUrl)
          ensureHreflang('en', enUrl)
          ensureHreflang('x-default', xDefault)
        } catch {
          // Fallback gracefully to same-path if URL parsing fails
          ensureHreflang('ne', url)
          ensureHreflang('en', url)
        }
      } else {
        ensureHreflang('ne', url)
        ensureHreflang('en', url)
      }
    }
    if (title) {
      ensureMeta('meta[property="og:title"]', 'content', title)
      ensureMeta('meta[name="twitter:title"]', 'content', title)
    }
    if (description) {
      ensureMeta('meta[property="og:description"]', 'content', description)
      ensureMeta('meta[name="twitter:description"]', 'content', description)
    }
    if (image) {
      ensureMeta('meta[property="og:image"]', 'content', image)
      ensureMeta('meta[name="twitter:image"]', 'content', image)
      ensureMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
    } else {
      ensureMeta('meta[name="twitter:card"]', 'content', 'summary')
    }
    if (locale) {
      ensureMeta('meta[property="og:locale"]', 'content', locale)
    }
  }, [title, description, url, image, locale, localizedUrlStrategy, alternates])

  return null
}
