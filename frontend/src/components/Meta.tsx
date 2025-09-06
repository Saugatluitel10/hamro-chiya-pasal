import { useEffect } from 'react'

export type MetaProps = {
  title?: string
  description?: string
  url?: string
  image?: string
  locale?: string
}

// Lightweight per-route meta manager. No external deps.
export default function Meta({ title, description, url, image, locale }: MetaProps) {
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

    const ensureHreflang = (lang: 'ne' | 'en', href: string) => {
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
      // Provide per-route hreflang alternates
      ensureHreflang('ne', url)
      ensureHreflang('en', url)
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
    }
    if (locale) {
      ensureMeta('meta[property="og:locale"]', 'content', locale)
    }
  }, [title, description, url, image, locale])

  return null
}
