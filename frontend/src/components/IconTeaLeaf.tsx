export type IconTeaLeafProps = {
  className?: string
  size?: number
  title?: string
}

export default function IconTeaLeaf({ className, size = 18, title = 'Tea leaf' }: IconTeaLeafProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label={title}
      className={className}
   >
      {/* Simple stylized tea leaf */}
      <path d="M19.5 3.5c-4.35.26-7.76 1.82-9.98 4.04C6.3 10.76 5.5 14.5 5.5 20.5c6 0 9.74-.8 12.96-4.02 2.22-2.22 3.78-5.63 4.04-9.98-2.07.9-3.79 1.28-5.38 1.37-1.59.1-3.03-.11-4.53-.61 1.1-.9 2.44-1.63 4.02-2.21 1.58-.58 3.41-.93 5.39-1.15-1.08-1.08-3.02-1.61-5.9-1.4Z"/>
      {/* Midrib */}
      <path d="M7 19c4.5-4.5 6.5-8.5 7.5-12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
