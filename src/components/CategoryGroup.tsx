// Aufklappbare Kategorie-Gruppe. Der Auf/Zu-Zustand wird von oben (App)
// gesteuert, damit er beim Tab-Wechsel erhalten bleibt.
// Bestehende Habits landen in dieser Kategorie entweder über das kleine "+"
// (neu anlegen ODER einen vorhandenen Habit auswählen) oder per Drag & Drop
// auf die Kopfzeile.

import { useState } from 'react'
import type { CSSProperties, DragEvent } from 'react'
import type { Habit } from '../types/habit'
import type { Category } from '../lib/categories'
import { todayKey } from '../lib/date'
import { HabitCard } from './HabitCard'

interface CategoryGroupProps {
  category: Category
  habits: Habit[]
  allActiveHabits: Habit[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onToggleYesterday: (id: string) => void
  onReorder: (fromId: string, toId: string) => void
  onAddHabit: (name: string, category: string) => void
  onMoveIn: (id: string) => void
}

export function CategoryGroup({
  category,
  habits,
  allActiveHabits,
  open,
  onOpenChange,
  onToggle,
  onEdit,
  onToggleYesterday,
  onReorder,
  onAddHabit,
  onMoveIn,
}: CategoryGroupProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [headerDragOver, setHeaderDragOver] = useState(false)
  const today = todayKey()
  const doneToday = habits.filter((h) => h.done[today]).length
  const candidates = allActiveHabits.filter((h) => h.category !== category.id)

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

  function handleHeaderDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!headerDragOver) setHeaderDragOver(true)
  }
  function handleHeaderDrop(e: DragEvent) {
    e.preventDefault()
    setHeaderDragOver(false)
    const fromId = e.dataTransfer.getData('text/plain')
    if (fromId) onMoveIn(fromId)
  }

  return (
    <div className="cat-group" style={{ '--cat-color': category.color } as CSSProperties}>
      <div
        className={`cat-header${headerDragOver ? ' drag-over' : ''}`}
        onDragOver={handleHeaderDragOver}
        onDragLeave={() => setHeaderDragOver(false)}
        onDrop={handleHeaderDrop}
      >
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
            <div className="cat-add-panel">
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

              {candidates.length > 0 && (
                <div className="cat-move-row">
                  <span className="cat-move-lbl">ODER VORHANDENEN VERSCHIEBEN:</span>
                  <select
                    className="j-input j-select"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onMoveIn(e.target.value)
                        setAdding(false)
                      }
                    }}
                    aria-label="Vorhandenen Habit hierher verschieben"
                  >
                    <option value="">— HABIT WÄHLEN —</option>
                    {candidates.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
