// Zentraler State-Hook: EINE Quelle der Wahrheit für alle Habits.
// Liest beim Start aus dem localStorage und speichert bei jeder Änderung automatisch.
// Komponenten rufen useHabits() auf und bekommen Daten + Aktionen.

import { useEffect, useState } from 'react'
import type { Habit } from '../types/habit'
import { loadHabits, saveHabits } from '../lib/storage'
import { todayKey } from '../lib/date'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits())

  // Jedes Mal wenn sich `habits` ändert, in den localStorage schreiben.
  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  function addHabit(name: string) {
    const clean = name.trim()
    if (!clean) return
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: clean.toUpperCase(),
      done: {},
    }
    setHabits((prev) => [...prev, habit])
  }

  // Hakt den heutigen Tag an/ab (toggle).
  function toggleToday(id: string) {
    const key = todayKey()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = { ...h.done }
        if (done[key]) delete done[key]
        else done[key] = true
        return { ...h, done }
      }),
    )
  }

  function renameHabit(id: string, name: string) {
    const clean = name.trim()
    if (!clean) return
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: clean.toUpperCase() } : h)),
    )
  }

  function removeHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  return { habits, addHabit, toggleToday, renameHabit, removeHabit }
}
