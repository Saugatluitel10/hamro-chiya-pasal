import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n/I18nProvider'

type Props = {
  src: string
  alt?: string
  caption?: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

export default function Lightbox({ src, alt = '', caption, onClose, onPrev, onNext }: Props) {
  const { t } = useI18n()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {onPrev ? (
        <button
          aria-label={t('lightbox.prev')}
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-2xl"
        >
          ‹
        </button>
      ) : null}
      <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[80vh] max-w-[90vw] rounded shadow-lg" />
        {caption ? (
          <div className="mt-2 text-center text-sm text-white/90">{caption}</div>
        ) : null}
      </div>
      {onNext ? (
        <button
          aria-label={t('lightbox.next')}
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-2xl"
        >
          ›
        </button>
      ) : null}
      <button
        aria-label={t('lightbox.close')}
        onClick={onClose}
        className="absolute top-3 right-3 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>,
    document.body
  )
}
