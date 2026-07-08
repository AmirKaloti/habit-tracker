// Dropdown zum Filtern der Startseite nach Kategorie. "ALLE KATEGORIEN" zeigt
// wieder alles — Habits ohne Kategorie werden davon nie ausgeblendet.

import { CATEGORIES } from '../lib/categories'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <select
      className="j-input j-select category-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Nach Kategorie filtern"
    >
      <option value="">ALLE KATEGORIEN</option>
      {CATEGORIES.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
