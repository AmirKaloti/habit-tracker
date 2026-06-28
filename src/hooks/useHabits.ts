// Zentraler State-Hook: EINE Quelle der Wahrheit für alle Habits.
// Liest beim Start aus dem localStorage und speichert bei jeder Änderung automatisch.
// Komponenten rufen useHabits() auf und bekommen Daten + Aktionen.

import { useEffect, useState } from 'react'
import type { Habit } from '../types/habit'
import { loadHabits, saveHabits } from '../lib/storage'
import { todayKey } from '../lib/date'

const HABIT_COLORS = [
  '#fb923c', // orange
  '#e879f9', // fuchsia
  '#60a5fa', // blue
  '#34d399', // emerald
  '#facc15', // yellow
  '#a78bfa', // violet
  '#f472b6', // pink
  '#4ade80', // green
]

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits())

  // Jedes Mal wenn sich `habits` ändert, in den localStorage schreiben.
  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  function addHabit(name: string) {
    const clean = name.trim()
    if (!clean) return
    setHabits((prev) => {
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: clean.toUpperCase(),
        done: {},
        color: HABIT_COLORS[prev.length % HABIT_COLORS.length],
      }
      return [...prev, habit]
    })
  }

  // Hakt einen beliebigen Tag (per Datums-Schlüssel "YYYY-MM-DD") an/ab.
  function toggleDay(id: string, key: string) {
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

  // Bequemer Spezialfall: den heutigen Tag an/ab.
  function toggleToday(id: string) {
    toggleDay(id, todayKey())
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

  return { habits, addHabit, toggleToday, toggleDay, renameHabit, removeHabit }
}
