// Eine einzelne Habit-Zeile: Check-Button, Name, Streak-Counter, Bearbeiten-Button.

import type { Habit } from '../types/habit'
import { todayKey } from '../lib/date'
import { currentStreak } from '../lib/streak'

interface HabitCardProps {
  habit: Habit
  onToggle: (id: string) => void
  onEdit: (id: string) => void
}

export function HabitCard({ habit, onToggle, onEdit }: HabitCardProps) {
  const done = !!habit.done[todayKey()]
  const streak = currentStreak(habit)

  return (
    <div className={`habit-card${done ? ' done' : ''}`}>
      <button
        className={`check-btn${done ? ' done' : ''}`}
        onClick={() => onToggle(habit.id)}
        aria-label={done ? 'Als offen markieren' : 'Als erledigt markieren'}
      >
        {done ? '✓' : ''}
      </button>

      <div className="habit-info">
        <div className="habit-name">{habit.name}</div>
        <div className="habit-sub">{done ? '✓ HEUTE ERLEDIGT' : '— AUSSTEHEND'}</div>
      </div>

      <div className="habit-streak">
        <div className="streak-num">{streak}</div>
        <div className="streak-lbl">STREAK</div>
      </div>

      <button className="edit-btn" onClick={() => onEdit(habit.id)} aria-label="Habit bearbeiten">
        ✎
      </button>
    </div>
  )
}
