import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Habit } from '../types/habit'

// vi.hoisted, weil vi.mock() über die Importe hinaus nach oben gehoben wird —
// die Mock-Funktionen müssen also schon vor dem Hochheben existieren.
const { from, eq, maybeSingle, upsert } = vi.hoisted(() => {
  const maybeSingle = vi.fn()
  const eq = vi.fn(() => ({ maybeSingle }))
  const select = vi.fn(() => ({ eq }))
  const upsert = vi.fn(async () => ({ data: null, error: null }))
  const from = vi.fn(() => ({ select, upsert }))
  return { from, eq, maybeSingle, upsert }
})

vi.mock('./supabase', () => ({ supabase: { from } }))

const { loadHabitsCloud, saveHabitsCloud } = await import('./cloudStorage')

const habits: Habit[] = [{ id: 'a', name: 'SPORT', done: {} }]

describe('cloudStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loadHabitsCloud liefert die habits-Spalte der eigenen Zeile', async () => {
    maybeSingle.mockResolvedValue({ data: { habits }, error: null })
    const result = await loadHabitsCloud('user-1')
    expect(result).toEqual(habits)
    expect(from).toHaveBeenCalledWith('habit_data')
    expect(eq).toHaveBeenCalledWith('user_id', 'user-1')
  })

  it('liefert ein leeres Array, wenn noch keine Zeile existiert', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null })
    expect(await loadHabitsCloud('user-1')).toEqual([])
  })

  it('liefert null bei einem Fehler (nicht dasselbe wie ein leerer Account)', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: 'boom' } })
    expect(await loadHabitsCloud('user-1')).toBeNull()
  })

  it('saveHabitsCloud upserted user_id + habits', async () => {
    await saveHabitsCloud('user-1', habits)
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', habits }),
    )
  })
})
