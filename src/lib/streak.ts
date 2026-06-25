// Berechnet die aktuelle Streak: wie viele Tage in Folge (bis heute) wurde der Habit erledigt.
// Reine Funktion -> bei gleichem Input immer gleiches Ergebnis, einfach zu testen.

import type { Habit } from '../types/habit'
import { toKey } from './date'

export function currentStreak(habit: Habit): number {
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // Rückwärts vom heutigen Tag laufen, solange jeder Tag erledigt ist.
  while (habit.done[toKey(cursor)]) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// Längste Streak über alle Habits (für die Statistik-Leiste).
export function bestStreak(habits: Habit[]): number {
  return habits.reduce((max, h) => Math.max(max, currentStreak(h)), 0)
}
