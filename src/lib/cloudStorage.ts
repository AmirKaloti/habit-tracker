// Cloud-Gegenstück zu lib/storage.ts — dieselbe Signatur (load/save), damit
// useHabits.ts kaum angepasst werden muss. Eine Zeile pro Nutzer in
// `habit_data`, geschützt durch Row-Level-Security (siehe Bauplan/README).

import type { Habit } from '../types/habit'
import { supabase } from './supabase'

// Gibt `null` zurück, wenn das Laden fehlgeschlagen ist (z. B. Netzwerkfehler) —
// das ist NICHT dasselbe wie ein leeres Array (= Account existiert, hat aber noch
// keine Habits). Diese Unterscheidung verhindert, dass bei einem Fehler versehentlich
// lokale Daten über bestehende Cloud-Daten geschrieben werden.
export async function loadHabitsCloud(userId: string): Promise<Habit[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('habit_data')
    .select('habits')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) return null
  if (!data) return []
  return Array.isArray(data.habits) ? (data.habits as Habit[]) : []
}

export async function saveHabitsCloud(userId: string, habits: Habit[]): Promise<void> {
  if (!supabase) return
  await supabase
    .from('habit_data')
    .upsert({ user_id: userId, habits, updated_at: new Date().toISOString() })
}
