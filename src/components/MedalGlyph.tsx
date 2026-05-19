/** Inline medal glyph for bot workshop upgrade costs. */
export function MedalGlyph({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <img src="/icons/medal.webp" alt="" width={16} height={16} className="workshop-medal-img" />
    </span>
  )
}
