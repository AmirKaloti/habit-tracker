import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { completionRate } from './stats'
import { toKey } from './date'
import type { Habit } from '../types/habit'

// Zeit einfrieren, damit "letzte 30 Tage" reproduzierbar ist.
const TODAY = new Date(2026, 5, 25, 12, 0, 0)

function dayAgo(n: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return toKey(d)
}

function makeHabit(doneDays: number[]): Habit {
  const done: Record<string, boolean> = {}
  for (const n of doneDays) done[dayAgo(n)] = true
  return { id: 'x', name: 'TEST', done }
}

describe('completionRate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(TODAY)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('zählt erledigte Tage in den letzten 30 Tagen', () => {
    const habit = makeHabit([0, 1, 2]) // heute, gestern, vorgestern
    expect(completionRate(habit, 30)).toEqual({ done: 3, total: 30 })
  })

  it('gibt 0 zurück, wenn nichts erledigt wurde', () => {
    expect(completionRate(makeHabit([]), 30)).toEqual({ done: 0, total: 30 })
  })

  it('ignoriert Tage, die älter als der Zeitraum sind', () => {
    const habit = makeHabit([0, 40]) // heute + ein Tag vor 40 Tagen
    expect(completionRate(habit, 30)).toEqual({ done: 1, total: 30 })
  })

  it('respektiert einen kürzeren Zeitraum', () => {
    const habit = makeHabit([0, 1, 5])
    expect(completionRate(habit, 3)).toEqual({ done: 2, total: 3 })
  })
})
