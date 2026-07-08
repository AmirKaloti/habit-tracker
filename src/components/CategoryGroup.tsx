// Aufklappbare Kategorie-Gruppe: zeigt zuerst nur die Kategorie-Kopfzeile.
// Klick auf den Pfeil klappt die Habits dieser Kategorie darunter auf/zu.

import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Habit } from '../types/habit'
import type { Category } from '../lib/categories'
import { todayKey } from '../lib/date'
import { HabitCard } from './HabitCard'

interface CategoryGroupProps {
  category: Category
  habits: Habit[]
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onMarkYesterday: (id: string) => void
}

export function CategoryGroup({
  category,
  habits,
  onToggle,
  onEdit,
  onMarkYesterday,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(false)
  const today = todayKey()
  const doneToday = habits.filter((h) => h.done[today]).length

  return (
    <div className="cat-group" style={{ '--cat-color': category.color } as CSSProperties}>
      <button
        className={`cat-header${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="cat-chevron">▶</span>
        <span className="cat-dot" />
        <span className="cat-name">{category.name.toUpperCase()}</span>
        <span className="cat-count">
          {doneToday}/{habits.length} HEUTE · {habits.length}{' '}
          {habits.length === 1 ? 'HABIT' : 'HABITS'}
        </span>
      </button>

      {open && (
        <div className="cat-body">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggle={onToggle}
              onEdit={onEdit}
              onMarkYesterday={onMarkYesterday}
            />
          ))}
        </div>
      )}
    </div>
  )
}
