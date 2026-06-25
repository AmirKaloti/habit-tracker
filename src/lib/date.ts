// Reine Datums-Helfer. Keine React-Abhängigkeit, leicht testbar.

// Wandelt ein Date in einen stabilen Schlüssel "YYYY-MM-DD" um (lokale Zeitzone).
export function toKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Schlüssel für den heutigen Tag.
export function todayKey(): string {
  return toKey(new Date())
}

// Wochentage und Monatsnamen auf Deutsch, Montag zuerst.
export const WEEKDAYS = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO']
export const MONTHS = [
  'JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI',
  'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER',
]

// Index 0=Montag ... 6=Sonntag (JS liefert standardmäßig 0=Sonntag).
export function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}
