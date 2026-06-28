import { describe, it, expect, beforeEach } from 'vitest'
import { loadHabits, saveHabits } from './storage'
import type { Habit } from '../types/habit'

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('speichert und lädt Habits unverändert (round-trip)', () => {
    const habits: Habit[] = [{ id: '1', name: 'LESEN', done: { '2026-06-25': true } }]
    saveHabits(habits)
    expect(loadHabits()).toEqual(habits)
  })

  it('liefert ein leeres Array, wenn nichts gespeichert ist', () => {
    expect(loadHabits()).toEqual([])
  })

  it('liefert ein leeres Array bei beschädigten Daten', () => {
    localStorage.setItem('habitron_v1', 'kein-gültiges-json{{{')
    expect(loadHabits()).toEqual([])
  })
})
