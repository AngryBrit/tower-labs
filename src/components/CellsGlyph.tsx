/** Inline cells glyph for bot special-unlock costs. */
export function CellsGlyph({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <img
        src="/icons/elite-cell.webp"
        alt=""
        width={16}
        height={16}
        className="workshop-cells-img"
      />
    </span>
  )
}
