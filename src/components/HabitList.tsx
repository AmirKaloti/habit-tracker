// Liste aller Habits. Zeigt einen Leerzustand, wenn noch keiner existiert.

import type { Habit } from '../types/habit'
import { HabitCard } from './HabitCard'

interface HabitListProps {
  habits: Habit[]
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onToggleYesterday: (id: string) => void
  onReorder: (fromId: string, toId: string) => void
}

export function HabitList({
  habits,
  onToggle,
  onEdit,
  onToggleYesterday,
  onReorder,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◎</div>
        <div className="empty-text">KEINE HABITS — KLICKE "NEW HABIT" ZUM STARTEN</div>
      </div>
    )
  }

  return (
    <div>
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
  )
}
