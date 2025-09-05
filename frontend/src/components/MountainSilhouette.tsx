export type MountainSilhouetteProps = {
  className?: string
  height?: number
  title?: string
}

/**
 * Responsive mountain silhouette for hero sections.
 * Uses currentColor for fill; control color via Tailwind (e.g., text-white/30).
 */
export default function MountainSilhouette({ className, height = 140, title = 'Mountain silhouette' }: MountainSilhouetteProps) {
  return (
    <svg
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      width="100%"
      height={height}
    >
      {/* Layer 1 */}
      <path
        d="M0 150 L120 120 L220 160 L360 100 L460 140 L560 90 L680 150 L780 110 L900 160 L1040 120 L1160 150 L1300 110 L1440 150 L1440 200 L0 200 Z"
        fill="currentColor"
        opacity="0.35"
      />
      {/* Layer 2 */}
      <path
        d="M0 130 L100 100 L220 140 L320 80 L420 120 L540 70 L640 130 L760 90 L880 140 L1000 100 L1140 130 L1260 90 L1440 130 L1440 200 L0 200 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* Layer 3 (foreground ridge) */}
      <path
        d="M0 120 L80 90 L180 120 L260 70 L360 110 L460 60 L560 110 L660 80 L760 120 L860 90 L980 120 L1080 80 L1200 110 L1320 85 L1440 120 L1440 200 L0 200 Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  )
}
