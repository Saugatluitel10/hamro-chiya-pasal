import { useEffect, useState } from 'react'

export type ToastItem = {
  id: number
  message: string
  type?: 'success' | 'error' | 'info'
  durationMs?: number
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    let idSeq = Date.now()
    function onToast(e: Event) {
      const ce = e as CustomEvent
      const detail = (ce.detail || {}) as Partial<ToastItem>
      const item: ToastItem = {
        id: ++idSeq,
        message: String(detail.message ?? ''),
        type: detail.type ?? 'info',
        durationMs: detail.durationMs ?? 3000,
      }
      setToasts((prev) => [...prev, item])
      // auto-remove
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id))
      }, item.durationMs)
    }
    window.addEventListener('app:toast', onToast)
    return () => window.removeEventListener('app:toast', onToast)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            'min-w-[220px] max-w-xs rounded-md shadow-md px-3 py-2 text-sm border ' +
            (t.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/40'
              : t.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-900/40'
              : 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700')
          }
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
