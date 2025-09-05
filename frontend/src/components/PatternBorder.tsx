export type PatternBorderProps = {
  className?: string
  title?: string
}

/**
 * A subtle decorative border inspired by traditional motifs.
 * Uses currentColor, so set via text-[--color-accent] or text-[--color-primary].
 */
export default function PatternBorder({ className, title = 'Decorative border' }: PatternBorderProps) {
  return (
    <svg
      className={className}
      role="img"
      aria-label={title}
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="8"
    >
      {/* baseline */}
      <line x1="0" y1="4" x2="200" y2="4" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      {/* center diamond */}
      <path d="M100 1 L104 4 L100 7 L96 4 Z" fill="currentColor" />
      {/* side diamonds */}
      <path d="M70 2 L72.5 4 L70 6 L67.5 4 Z" fill="currentColor" opacity="0.7" />
      <path d="M130 2 L132.5 4 L130 6 L127.5 4 Z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
