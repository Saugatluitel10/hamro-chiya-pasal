import React from 'react'

export function FormField({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={["space-y-1", className].join(' ')}>{children}</div>
}

export function HelpText({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <p className={["text-xs text-gray-600 dark:text-gray-400", className].join(' ')}>{children}</p>
}
