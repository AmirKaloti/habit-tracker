// Zentraler State-Hook: EINE Quelle der Wahrheit für alle Habits.
// Liest beim Start aus dem localStorage und speichert bei jeder Änderung automatisch.
// Komponenten rufen useHabits() auf und bekommen Daten + Aktionen.

import { useEffect, useState } from 'react'
import type { Habit } from '../types/habit'
import { loadHabits, saveHabits } from '../lib/storage'
import { todayKey, yesterdayKey } from '../lib/date'
import { categoryById } from '../lib/categories'
import { shade } from '../lib/color'
import { moveBefore } from '../lib/reorder'
import { HABIT_COLORS } from '../lib/palette'

// Bestimmt die Farbe für einen neuen Habit: mit Kategorie eine Farbvariante der
// Kategorie-Basisfarbe, ohne Kategorie die nächste Farbe aus der Standard-Palette.
function colorFor(existing: Habit[], category?: string): string {
  const cat = categoryById(category)
  if (cat) {
    const countInCategory = existing.filter((h) => h.category === category).length
    return shade(cat.color, countInCategory)
  }
  const uncategorized = existing.filter((h) => !h.category).length
  return HABIT_COLORS[uncategorized % HABIT_COLORS.length]
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits())

  // Jedes Mal wenn sich `habits` ändert, in den localStorage schreiben.
  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  // Legt einen Habit an. `active = false` macht ihn zu einem Entwurf (Draft).
  function addHabit(name: string, active = true, category?: string) {
    const clean = name.trim()
    if (!clean) return
    setHabits((prev) => {
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: clean.toUpperCase(),
        done: {},
        color: colorFor(prev, category),
        active,
        category,
      }
      return [...prev, habit]
    })
  }

  // Legt eine Habit-Idee an, die noch nicht aktiv ist (erscheint unter "Drafts").
  function addDraft(name: string) {
    addHabit(name, false)
  }

  // Verschiebt einen Entwurf zu den aktiven Habits.
  function activateHabit(id: string) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, active: true } : h)))
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

  // Schnellzugriff "hab ich gestern gemacht": schaltet den gestrigen Tag an/ab.
  function toggleYesterday(id: string) {
    toggleDay(id, yesterdayKey())
  }

  function renameHabit(id: string, name: string) {
    const clean = name.trim()
    if (!clean) return
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: clean.toUpperCase() } : h)),
    )
  }

  // Ändert die Farbe eines Habits (Farb-Wähler im Bearbeiten-Dialog).
  function setColor(id: string, color: string) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, color } : h)))
  }

  // Sortiert per Drag & Drop: verschiebt `fromId` vor `toId` UND übernimmt
  // dabei die Kategorie von `toId` — so landet ein hierher gezogener Habit
  // automatisch in derselben Kategorie (oder wird kategorielos, wenn `toId`
  // selbst keine Kategorie hat).
  function moveHabit(fromId: string, toId: string) {
    setHabits((prev) => {
      const target = prev.find((h) => h.id === toId)
      const reordered = moveBefore(prev, fromId, toId)
      if (!target) return reordered
      return reordered.map((h) =>
        h.id === fromId ? { ...h, category: target.category } : h,
      )
    })
  }

  // Weist einem Habit direkt eine Kategorie zu (oder entfernt sie mit
  // undefined) — für den Kategorie-Header als Drop-Ziel und die
  // "vorhandenen Habit verschieben"-Auswahl.
  function setCategory(id: string, category: string | undefined) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, category } : h)))
  }

  // Setzt (oder entfernt) das Wochenziel. 0 / undefined = kein Ziel.
  function setWeeklyGoal(id: string, goal: number | undefined) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const next = { ...h }
        if (goal && goal > 0) next.weeklyGoal = goal
        else delete next.weeklyGoal
        return next
      }),
    )
  }

  function removeHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  // Ersetzt ALLE Habits (für den Import einer Backup-Datei).
  function replaceAll(next: Habit[]) {
    setHabits(next)
  }

  return {
    habits,
    addHabit,
    addDraft,
    activateHabit,
    toggleToday,
    toggleDay,
    toggleYesterday,
    renameHabit,
    setColor,
    setCategory,
    setWeeklyGoal,
    moveHabit,
    removeHabit,
    replaceAll,
  }
}
