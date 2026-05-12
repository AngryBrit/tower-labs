export type LabPreset = {
  id: string
  name: string
  levelOverrides: Record<string, number>
}

export type LabPresetsFileV1 = {
  v: 1
  activePresetId: string | null
  presets: LabPreset[]
  /** Last scratch workspace when a named preset is active; current levels when scratch is active. */
  scratchOverrides: Record<string, number>
}

export function newPresetId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function isLabPreset(x: unknown): x is LabPreset {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return false
  const lo = o.levelOverrides
  if (!lo || typeof lo !== 'object' || Array.isArray(lo)) return false
  return true
}

export function parseLabPresetsFile(raw: unknown): LabPresetsFileV1 | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (o.v !== 1) return null
  if (!Array.isArray(o.presets) || !o.presets.every(isLabPreset)) return null
  const scratch = o.scratchOverrides
  if (
    scratch !== undefined &&
    (typeof scratch !== 'object' || scratch === null || Array.isArray(scratch))
  ) {
    return null
  }
  const active = o.activePresetId
  if (active !== null && active !== undefined && typeof active !== 'string') {
    return null
  }
  return {
    v: 1,
    activePresetId: typeof active === 'string' ? active : null,
    presets: o.presets as LabPreset[],
    scratchOverrides:
      scratch && typeof scratch === 'object' && !Array.isArray(scratch)
        ? (scratch as Record<string, number>)
        : {},
  }
}

/** Build the object to persist; merges current `levelOverrides` into the active preset entry. */
export function buildLabPresetsPayload(
  activePresetId: string | null,
  presets: readonly LabPreset[],
  levelOverrides: Record<string, number>,
  scratchSnapshot: Record<string, number>,
): LabPresetsFileV1 {
  const mergedPresets = activePresetId
    ? presets.map((p) =>
        p.id === activePresetId
          ? { ...p, levelOverrides: { ...levelOverrides } }
          : p,
      )
    : [...presets]

  return {
    v: 1,
    activePresetId,
    presets: mergedPresets,
    scratchOverrides: activePresetId ? { ...scratchSnapshot } : { ...levelOverrides },
  }
}
