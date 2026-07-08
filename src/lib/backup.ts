// Export/Import der Habit-Daten als JSON-Datei — die "dauerhafte Sicherung".
// Reine Logik (Serialisieren/Parsen + Validierung), ohne DOM. Der eigentliche
// Datei-Download/-Upload passiert in der Komponente DataBackup.

import type { Habit } from '../types/habit'

interface BackupFile {
  app: 'master-your-habit'
  version: number
  exportedAt: string
  habits: Habit[]
}

// Wandelt die Habits in einen lesbaren JSON-Text zum Speichern um.
export function habitsToJson(habits: Habit[], now: string): string {
  const data: BackupFile = {
    app: 'master-your-habit',
    version: 1,
    exportedAt: now,
    habits,
  }
  return JSON.stringify(data, null, 2)
}

// Liest Habits aus einem JSON-Text (Backup-Datei ODER eine reine Habit-Liste).
// Wirft einen Fehler, wenn das Format nicht passt. Filtert kaputte Einträge raus.
export function habitsFromJson(raw: string): Habit[] {
  const parsed: unknown = JSON.parse(raw)
  const list: unknown = Array.isArray(parsed)
    ? parsed
    : (parsed as { habits?: unknown }).habits

  if (!Array.isArray(list)) {
    throw new Error('Datei enthält keine Habit-Liste.')
  }

  const valid = list.filter(
    (h): h is Habit =>
      !!h &&
      typeof h === 'object' &&
      typeof (h as Habit).id === 'string' &&
      typeof (h as Habit).name === 'string' &&
      typeof (h as Habit).done === 'object' &&
      (h as Habit).done !== null,
  )

  if (valid.length === 0) {
    throw new Error('Keine gültigen Habits in der Datei gefunden.')
  }
  return valid
}
