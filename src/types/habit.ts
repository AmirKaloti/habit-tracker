// Die zentrale Datenstruktur der App. Alles dreht sich um diesen Typ.
// `done` ist eine Map von Datum ("2026-06-25") -> true. Fehlt ein Tag, gilt er als nicht erledigt.

export interface Habit {
  id: string
  name: string
  done: Record<string, boolean>
  color?: string
  // undefined oder true = aktiver Habit; false = Entwurf/Idee (Draft), noch nicht aktiv.
  active?: boolean
  // Kategorie-ID (siehe lib/categories.ts). Optional — ohne Kategorie erscheint
  // der Habit ganz normal auf der Startseite.
  category?: string
  // Wochenziel: wie oft pro Woche der Habit erledigt werden soll (z. B. 5).
  // Optional — ohne Wert wird kein Wochenziel angezeigt.
  weeklyGoal?: number
}
