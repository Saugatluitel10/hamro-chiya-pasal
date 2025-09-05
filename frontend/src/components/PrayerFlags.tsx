import { motion, useReducedMotion } from 'framer-motion'

export type PrayerFlagsProps = {
  className?: string
  count?: number
  height?: number
  title?: string
}

/**
 * Prayer flags banner with gentle sway animation.
 * Designed to sit subtly at the top of hero/sections.
 *
 * Notes:
 * - Uses fixed viewBox width (1440). Positions scale responsively.
 * - Colors approximate traditional sequence: Blue, White, Red, Green, Yellow.
 */
export default function PrayerFlags({ className, count = 12, height = 70, title = 'Prayer flags' }: PrayerFlagsProps) {
  const width = 1440
  const colors = ['#1E3A8A', '#FFFFFF', '#DC2626', '#15803D', '#F59E0B'] // blue, white, red, green, yellow
  const prefersReduced = useReducedMotion()

  // Simple rope y function: subtle wave
  const ropeY = (x: number) => 26 + 8 * Math.sin(x / 120)

  // Build flag data
  const flags = Array.from({ length: count }).map((_, i) => {
    const x = ((i + 0.5) * width) / count
    const y = ropeY(x)
    const topLeft = `${x - 12},${y}`
    const topRight = `${x + 12},${y}`
    const bottom = `${x},${y + 26}`
    const color = colors[i % colors.length]
    return { i, x, y, topLeft, topRight, bottom, color }
  })

  // Build the rope path approximately
  const ropePath = `M0,${ropeY(0)} C 360,${ropeY(360) - 12} 720,${ropeY(720) + 12} 1080,${ropeY(1080) - 12} 1440,${ropeY(1440)}`

  return (
    <svg
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} 80`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
    >
      {/* Rope */}
      <path d={ropePath} stroke="rgba(0,0,0,0.35)" strokeWidth="2" fill="none" />

      {/* Flags */}
      {flags.map((f) => (
        <motion.g
          key={f.i}
          style={{ transformOrigin: `${f.x}px ${f.y}px` }}
          initial={{ rotate: 0 }}
          animate={prefersReduced ? { rotate: 0 } : { rotate: [-2, 1.5, -1.5, 2, -2] }}
          transition={prefersReduced ? { duration: 0 } : { duration: 4 + f.i * 0.08, repeat: Infinity, ease: 'easeInOut', delay: f.i * 0.05 }}
        >
          <polygon points={`${f.topLeft} ${f.topRight} ${f.bottom}`} fill={f.color} stroke="rgba(0,0,0,0.15)" />
        </motion.g>
      ))}
    </svg>
  )
}
