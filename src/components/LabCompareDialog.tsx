import { useCallback, useState } from 'react'
import type { I18nFormatters, StringId } from '../i18n/dictionary'
import { compareLabLevelOverrides, type LabCompareResult } from '../labCompare'
import { serializeLabLevelOverridesCsv } from '../labLevelOverridesCsv'
import { parseLabLevelsPayload, type ParseLabLevelsError } from '../parseLabLevelsPayload'
import type { ResearchData } from '../types/research'
import { getLevelBounds } from '../types/research'

type TFn = (id: StringId) => string

function parseErrorMessage(t: TFn, err: ParseLabLevelsError): string {
  switch (err) {
    case 'empty':
      return t('sr_compare_parse_empty')
    case 'invalid_csv':
      return t('sr_compare_parse_invalid_csv')
    case 'share_decode_failed':
      return t('sr_compare_parse_share_fail')
    case 'invalid_payload':
      return t('sr_compare_parse_invalid_payload')
    default:
      return t('sr_compare_parse_invalid_payload')
  }
}

function levelCell(
  data: ResearchData,
  si: number,
  ii: number,
  n: number,
  t: TFn,
): string {
  const item = data.sections[si]?.items[ii]
  if (!item) return String(n)
  const max = getLevelBounds(item).max
  if (max > 0 && n >= max) return t('researchCard_max')
  return String(n)
}

export function LabCompareDialog({
  data,
  open,
  onClose,
  currentOverrides,
  t,
  fmt,
}: {
  data: ResearchData
  open: boolean
  onClose: () => void
  currentOverrides: Record<string, number>
  t: TFn
  fmt: I18nFormatters
}) {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [busy, setBusy] = useState(false)
  const [errorA, setErrorA] = useState<string | null>(null)
  const [errorB, setErrorB] = useState<string | null>(null)
  const [result, setResult] = useState<LabCompareResult | null>(null)

  const fillCurrent = useCallback(
    (side: 'a' | 'b') => {
      const csv = serializeLabLevelOverridesCsv(currentOverrides)
      if (side === 'a') {
        setTextA(csv)
        setErrorA(null)
      } else {
        setTextB(csv)
        setErrorB(null)
      }
      setResult(null)
    },
    [currentOverrides],
  )

  const runCompare = useCallback(async () => {
    setResult(null)
    setErrorA(null)
    setErrorB(null)
    setBusy(true)
    try {
      const [pa, pb] = await Promise.all([
        parseLabLevelsPayload(textA, data),
        parseLabLevelsPayload(textB, data),
      ])
      if (!pa.ok) {
        setErrorA(parseErrorMessage(t, pa.error))
        return
      }
      if (!pb.ok) {
        setErrorB(parseErrorMessage(t, pb.error))
        return
      }
      setResult(compareLabLevelOverrides(data, pa.overrides, pb.overrides))
    } finally {
      setBusy(false)
    }
  }, [data, textA, textB, t])

  const clearAll = useCallback(() => {
    setTextA('')
    setTextB('')
    setErrorA(null)
    setErrorB(null)
    setResult(null)
  }, [])

  if (!open) return null

  return (
    <div
      className="select-research__lab-data-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        id="lab-compare-dialog"
        className="select-research__compare-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-compare-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="lab-compare-title" className="select-research__lab-data-title">
          {t('sr_compare_title')}
        </h2>
        <p className="select-research__lab-data-intro">{t('sr_compare_intro')}</p>

        <div className="select-research__compare-grid">
          <div className="select-research__compare-col">
            <p className="select-research__compare-col-label">{t('sr_compare_build_a')}</p>
            <textarea
              className="select-research__compare-textarea glow-input"
              value={textA}
              onChange={(e) => {
                setTextA(e.target.value)
                setErrorA(null)
                setResult(null)
              }}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={errorA != null}
              aria-describedby={errorA ? 'lab-compare-err-a' : undefined}
              placeholder={t('sr_compare_placeholder')}
              rows={6}
            />
            {errorA ? (
              <p id="lab-compare-err-a" className="select-research__compare-field-error" role="alert">
                {errorA}
              </p>
            ) : null}
            <button
              type="button"
              className="glow-btn glow-btn--block select-research__compare-insert"
              onClick={() => fillCurrent('a')}
            >
              {t('sr_compare_use_current')}
            </button>
          </div>
          <div className="select-research__compare-col">
            <p className="select-research__compare-col-label">{t('sr_compare_build_b')}</p>
            <textarea
              className="select-research__compare-textarea glow-input"
              value={textB}
              onChange={(e) => {
                setTextB(e.target.value)
                setErrorB(null)
                setResult(null)
              }}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={errorB != null}
              aria-describedby={errorB ? 'lab-compare-err-b' : undefined}
              placeholder={t('sr_compare_placeholder')}
              rows={6}
            />
            {errorB ? (
              <p id="lab-compare-err-b" className="select-research__compare-field-error" role="alert">
                {errorB}
              </p>
            ) : null}
            <button
              type="button"
              className="glow-btn glow-btn--block select-research__compare-insert"
              onClick={() => fillCurrent('b')}
            >
              {t('sr_compare_use_current')}
            </button>
          </div>
        </div>

        <div className="select-research__compare-actions">
          <button
            type="button"
            className="glow-btn glow-btn--block"
            disabled={busy}
            onClick={() => void runCompare()}
          >
            {busy ? t('sr_compare_busy') : t('sr_compare_run')}
          </button>
          <button type="button" className="glow-btn glow-btn--block" onClick={clearAll}>
            {t('sr_compare_clear')}
          </button>
        </div>

        {result ? (
          <div className="select-research__compare-result" role="region" aria-live="polite">
            <dl className="select-research__compare-summary">
              <div className="select-research__compare-summary-row">
                <dt>{t('sr_compare_spent_a')}</dt>
                <dd>{result.spentALabel}</dd>
              </div>
              <div className="select-research__compare-summary-row">
                <dt>{t('sr_compare_spent_b')}</dt>
                <dd>{result.spentBLabel}</dd>
              </div>
              <div className="select-research__compare-summary-row">
                <dt>{t('sr_compare_coin_delta')}</dt>
                <dd>{result.coinDeltaLabel}</dd>
              </div>
            </dl>
            <p className="select-research__compare-diff-head">
              {fmt.compareDifferingLabsCount(result.differingCount)}
            </p>
            {result.differingCount > 0 ? (
              <div className="select-research__compare-table-wrap">
                <table className="select-research__compare-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('sr_compare_table_section')}</th>
                      <th scope="col">{t('sr_compare_table_lab')}</th>
                      <th scope="col">{t('sr_compare_table_lv_a')}</th>
                      <th scope="col">{t('sr_compare_table_lv_b')}</th>
                      <th scope="col">{t('sr_compare_table_delta')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.diffRows.map((row) => {
                      const d = row.levelB - row.levelA
                      const dStr = d > 0 ? `+${d}` : String(d)
                      return (
                        <tr key={`${row.sectionIndex}-${row.itemIndex}`}>
                          <td>{row.sectionTitle}</td>
                          <td>{row.name}</td>
                          <td>{levelCell(data, row.sectionIndex, row.itemIndex, row.levelA, t)}</td>
                          <td>{levelCell(data, row.sectionIndex, row.itemIndex, row.levelB, t)}</td>
                          <td>{dStr}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            <p className="select-research__compare-footnote">{t('sr_compare_footnote')}</p>
          </div>
        ) : null}

        <button type="button" className="glow-btn glow-btn--block select-research__lab-data-close" onClick={onClose}>
          {t('sr_close')}
        </button>
      </div>
    </div>
  )
}
