// Die zentrale Datenstruktur der App. Alles dreht sich um diesen Typ.
// `done` ist eine Map von Datum ("2026-06-25") -> true. Fehlt ein Tag, gilt er als nicht erledigt.

export interface Habit {
  id: string
  name: string
  done: Record<string, boolean>
  color?: string
}
