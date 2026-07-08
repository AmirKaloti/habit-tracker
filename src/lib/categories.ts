// Kategorien zum Strukturieren von Habits. Jede Kategorie hat eine Basisfarbe;
// Habits derselben Kategorie bekommen Farbvarianten davon (siehe lib/color.ts).
// Ein Habit muss keiner Kategorie angehören.

export interface Category {
  id: string
  name: string
  color: string
}

export const CATEGORIES: Category[] = [
  { id: 'distraction', name: 'Distraction / Stimulation', color: '#ef4444' },
  { id: 'health', name: 'Health', color: '#22c55e' },
]

export function categoryById(id?: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
