// Kümmert sich ausschließlich um das Lesen/Schreiben in den localStorage.
// Wenn wir später ein Backend wollen, ändern wir nur diese Datei.

import type { Habit } from '../types/habit'

const STORAGE_KEY = 'habitron_v1'

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}
