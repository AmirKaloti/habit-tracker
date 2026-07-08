// Kümmert sich ausschließlich um das Lesen/Schreiben in den localStorage.
// Wenn wir später ein Backend wollen, ändern wir nur diese Datei.
//
// Sicherheitsnetz gegen Datenverlust:
// - Vor jedem Speichern wird der bisherige (nicht-leere) Stand als Zweitkopie
//   ("_backup") gesichert. So überlebt ein versehentliches Leeren.
// - Beim Laden wird auf die Zweitkopie zurückgegriffen, wenn der Hauptspeicher
//   fehlt oder kaputt ist (aber ein bewusst leeres [] wird respektiert).

import type { Habit } from '../types/habit'

const STORAGE_KEY = 'habitron_v1'
const BACKUP_KEY = 'habitron_v1_backup'

// Liest eine Liste aus einem Schlüssel. Gibt null zurück, wenn er fehlt oder
// der Inhalt kaputt ist (im Gegensatz zu einem gültigen leeren Array []).
function readList(key: string): Habit[] | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Habit[]) : null
  } catch {
    return null
  }
}

export function loadHabits(): Habit[] {
  const primary = readList(STORAGE_KEY)
  // Gültiger Inhalt (auch ein bewusst leeres []) -> genau so verwenden.
  if (primary !== null) return primary
  // Hauptspeicher fehlt oder ist kaputt -> Zweitkopie retten.
  return readList(BACKUP_KEY) ?? []
}

export function saveHabits(habits: Habit[]): void {
  // Vorherigen nicht-leeren Stand als Backup sichern, BEVOR wir überschreiben.
  const current = readList(STORAGE_KEY)
  if (current && current.length > 0) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(current))
    } catch {
      // Backup ist "nice to have" — ein Fehler hier darf das Speichern nicht stoppen.
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}
