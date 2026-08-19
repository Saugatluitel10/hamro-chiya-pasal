import React from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const base = 'inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[--color-primary] text-white hover:bg-[#6f1616]',
  secondary: 'bg-[--color-surface] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost: 'bg-transparent text-[--color-primary] hover:bg-[--color-surface] dark:text-[--color-accent]',
}
const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
}

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return <button className={[base, variants[variant], sizes[size], className].join(' ')} {...props} />
}
