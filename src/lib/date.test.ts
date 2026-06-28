import { describe, it, expect } from 'vitest'
import { toKey, mondayIndex, WEEKDAYS, MONTHS } from './date'

describe('toKey', () => {
  it('formatiert ein Datum als YYYY-MM-DD mit führenden Nullen', () => {
    expect(toKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('mondayIndex', () => {
  it('liefert 0 für Montag und 6 für Sonntag', () => {
    // 22.06.2026 ist ein Montag, 28.06.2026 ein Sonntag.
    expect(mondayIndex(new Date(2026, 5, 22))).toBe(0)
    expect(mondayIndex(new Date(2026, 5, 28))).toBe(6)
  })
})

describe('Konstanten', () => {
  it('hat 7 Wochentage und 12 Monate', () => {
    expect(WEEKDAYS).toHaveLength(7)
    expect(MONTHS).toHaveLength(12)
  })
})
