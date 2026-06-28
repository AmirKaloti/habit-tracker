import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { currentStreak, bestStreak } from './streak'
import { toKey } from './date'
import type { Habit } from '../types/habit'

// Wir "frieren" die Zeit auf einen festen Tag ein, damit die Tests immer
// gleich laufen — egal wann sie ausgeführt werden.
const TODAY = new Date(2026, 5, 25, 12, 0, 0) // 25.06.2026, mittags

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(TODAY)
})

afterEach(() => {
  vi.useRealTimers()
})

// Hilfsfunktion: Datums-Schlüssel für "heute + offset Tage".
function keyFor(offsetDays: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offsetDays)
  return toKey(d)
}

function makeHabit(doneOffsets: number[]): Habit {
  const done: Record<string, boolean> = {}
  for (const o of doneOffsets) done[keyFor(o)] = true
  return { id: 'x', name: 'TEST', done }
}

describe('currentStreak', () => {
  it('zählt aufeinanderfolgende Tage bis heute', () => {
    expect(currentStreak(makeHabit([0, -1, -2]))).toBe(3)
  })

  it('ist 0, wenn heute nicht erledigt wurde', () => {
    expect(currentStreak(makeHabit([-1, -2]))).toBe(0)
  })

  it('stoppt bei der ersten Lücke', () => {
    // Heute erledigt, vorgestern erledigt, aber gestern nicht -> Streak = 1
    expect(currentStreak(makeHabit([0, -2]))).toBe(1)
  })

  it('ist 0 bei einem leeren Habit', () => {
    expect(currentStreak(makeHabit([]))).toBe(0)
  })
})

describe('bestStreak', () => {
  it('liefert die längste Streak über mehrere Habits', () => {
    const habits = [makeHabit([0]), makeHabit([0, -1, -2, -3]), makeHabit([])]
    expect(bestStreak(habits)).toBe(4)
  })

  it('ist 0 ohne Habits', () => {
    expect(bestStreak([])).toBe(0)
  })
})
