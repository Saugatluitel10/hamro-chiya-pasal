import React from 'react'

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export default function Card({ className = '', ...props }: CardProps) {
  const cls = [
    'rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm',
    className,
  ].join(' ')
  return <div className={cls} {...props} />
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-4 py-3 border-b border-gray-200 dark:border-gray-800", className].join(' ')} {...props} />
}
export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={["text-base font-semibold", className].join(' ')} {...props} />
}
export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-4 py-3", className].join(' ')} {...props} />
}
export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-4 py-3 border-t border-gray-200 dark:border-gray-800", className].join(' ')} {...props} />
}
