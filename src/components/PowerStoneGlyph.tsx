import { useId } from 'react'

/** Inline power-stone glyph matching `public/icons/power-stone.webp` (neon triangle + inner circle). */
export function PowerStoneGlyph({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const filterGlow = `power-stone-glow-${uid}`

  // Equilateral triangle in 108×97 art (see asset alpha bbox); circle at centroid.
  const baseY = 86
  const halfBase = 45
  const apexY = baseY - halfBase * Math.sqrt(3)
  const cy = (apexY + baseY + baseY) / 3

  return (
    <span className={className} aria-hidden>
      <svg
        viewBox="0 0 108 97"
        width="16"
        height="16"
        className="workshop-power-stone-svg"
      >
        <defs>
          <filter
            id={filterGlow}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="b" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.2" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter={`url(#${filterGlow})`}>
          <polygon
            points={`54,${apexY} ${54 + halfBase},${baseY} ${54 - halfBase},${baseY}`}
            fill="none"
            stroke="#00e901"
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.95"
          />
          <circle
            cx="54"
            cy={cy}
            r="15"
            fill="none"
            stroke="#00e901"
            strokeWidth="10"
            opacity="0.95"
          />
        </g>
        <polygon
          points={`54,${apexY} ${54 + halfBase},${baseY} ${54 - halfBase},${baseY}`}
          fill="none"
          stroke="#f7fffa"
          strokeWidth="3.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="54" cy={cy} r="15" fill="none" stroke="#f7fffa" strokeWidth="3.2" />
      </svg>
    </span>
  )
}
