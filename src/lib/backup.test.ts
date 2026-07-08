import { describe, it, expect } from 'vitest'
import { habitsToJson, habitsFromJson } from './backup'
import type { Habit } from '../types/habit'

const habits: Habit[] = [
  { id: 'a', name: 'SPORT', done: { '2026-06-25': true }, color: '#fb923c' },
]

describe('backup', () => {
  it('Round-Trip: Export und wieder Import ergibt dieselben Habits', () => {
    const json = habitsToJson(habits, '2026-06-25T12:00:00.000Z')
    expect(habitsFromJson(json)).toEqual(habits)
  })

  it('akzeptiert auch eine reine Habit-Liste (ohne Wrapper-Objekt)', () => {
    const json = JSON.stringify(habits)
    expect(habitsFromJson(json)).toEqual(habits)
  })

  it('wirft einen Fehler bei einem Format ohne Habit-Liste', () => {
    expect(() => habitsFromJson('{"foo":1}')).toThrow()
  })

  it('filtert kaputte Einträge heraus, behält gültige', () => {
    const json = JSON.stringify([{ id: 'a', name: 'X', done: {} }, { nope: true }, null])
    expect(habitsFromJson(json)).toHaveLength(1)
  })
})
