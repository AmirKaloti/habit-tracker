// Aufklappbare Kategorie-Gruppe. Der Auf/Zu-Zustand wird von oben (App)
// gesteuert, damit er beim Tab-Wechsel erhalten bleibt.
// Über das kleine "+" kann direkt ein Habit in dieser Kategorie angelegt werden.

import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Habit } from '../types/habit'
import type { Category } from '../lib/categories'
import { todayKey } from '../lib/date'
import { HabitCard } from './HabitCard'

interface CategoryGroupProps {
  category: Category
  habits: Habit[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onToggleYesterday: (id: string) => void
  onReorder: (fromId: string, toId: string) => void
  onAddHabit: (name: string, category: string) => void
}

export function CategoryGroup({
  category,
  habits,
  open,
  onOpenChange,
  onToggle,
  onEdit,
  onToggleYesterday,
  onReorder,
  onAddHabit,
}: CategoryGroupProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const today = todayKey()
  const doneToday = habits.filter((h) => h.done[today]).length

  function startAdding() {
    onOpenChange(true) // Gruppe aufklappen, damit man das Formular + Ergebnis sieht
    setAdding(true)
  }

  function submit() {
    const clean = name.trim()
    if (!clean) return
    onAddHabit(clean, category.id)
    setName('')
    setAdding(false)
  }

  return (
    <div className="cat-group" style={{ '--cat-color': category.color } as CSSProperties}>
      <div className="cat-header">
        <button
          className={`cat-toggle${open ? ' open' : ''}`}
          onClick={() => onOpenChange(!open)}
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
        <button
          className="cat-add-btn"
          onClick={startAdding}
          title={`Habit zu „${category.name}" hinzufügen`}
          aria-label={`Habit zu ${category.name} hinzufügen`}
        >
          +
        </button>
      </div>

      {open && (
        <div className="cat-body">
          {adding && (
            <div className="cat-add-form">
              <input
                className="j-input"
                style={{ flex: 1 }}
                placeholder={`NEUER HABIT IN ${category.name.toUpperCase()}…`}
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit()
                  if (e.key === 'Escape') setAdding(false)
                }}
              />
              <button className="j-btn" onClick={submit}>
                ADD
              </button>
              <button
                className="j-btn j-btn-ghost"
                onClick={() => setAdding(false)}
                aria-label="Abbrechen"
              >
                ✕
              </button>
            </div>
          )}

          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggle={onToggle}
              onEdit={onEdit}
              onToggleYesterday={onToggleYesterday}
              onReorder={onReorder}
            />
          ))}
        </div>
      )}
    </div>
  )
}
