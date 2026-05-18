/** Inline coin glyph (matches workshop cost chip); use for coin rows where WebP is not desired. */
export function CoinGlyph({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 20 20" width="16" height="16" className="workshop-coin-svg">
        <circle cx="10" cy="10" r="8.5" fill="#ca8a04" stroke="#facc15" strokeWidth="1.2" />
        <text
          x="10"
          y="13.5"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#422006"
        >
          C
        </text>
      </svg>
    </span>
  )
}
