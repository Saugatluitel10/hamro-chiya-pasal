import type { HTMLAttributes } from 'react'

export function SkeletonBlock({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`} {...rest} />
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      ))}
    </div>
  )
}
