import React from 'react'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const base = 'border rounded px-3 py-2 bg-[--color-surface] dark:bg-gray-900 border-gray-200 dark:border-gray-800 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent]'

export default function Select({ className = '', ...props }: SelectProps) {
  return <select className={[base, className].join(' ')} {...props} />
}
