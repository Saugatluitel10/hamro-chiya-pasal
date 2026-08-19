import React from 'react'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const base = 'block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1'

export default function Label({ className = '', ...props }: LabelProps) {
  return <label className={[base, className].join(' ')} {...props} />
}
