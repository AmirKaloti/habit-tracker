import type { CSSProperties } from 'react'
import type { Habit } from '../types/habit'
import { todayKey } from '../lib/date'
import { currentStreak } from '../lib/streak'
import { completionRate } from '../lib/stats'

interface HabitCardProps {
  habit: Habit
  onToggle: (id: string) => void
  onEdit: (id: string) => void
}

export function HabitCard({ habit, onToggle, onEdit }: HabitCardProps) {
  const done = !!habit.done[todayKey()]
  const streak = currentStreak(habit)
  const color = habit.color ?? '#fb923c'
  const rate = completionRate(habit, 30)
  const pct = Math.round((rate.done / rate.total) * 100)

  return (
    <div
      className={`habit-card${done ? ' done' : ''}`}
      style={{ '--habit-color': color } as CSSProperties}
    >
      <div className="habit-card-top">
        <button
          className={`check-btn${done ? ' done' : ''}`}
          onClick={() => onToggle(habit.id)}
          aria-label={done ? 'Als offen markieren' : 'Als erledigt markieren'}
        >
          {done ? '✓' : ''}
        </button>

        <div className="habit-info">
          <div className="habit-name">{habit.name}</div>
          <div className="habit-sub">
            {done ? '✓ HEUTE ERLEDIGT' : '— AUSSTEHEND'} · {rate.done}/{rate.total} ·{' '}
            {pct}%
          </div>
        </div>

        <div className="habit-streak">
          <div className="streak-num">{streak}</div>
          <div className="streak-lbl">STREAK</div>
        </div>

        <button
          className="edit-btn"
          onClick={() => onEdit(habit.id)}
          aria-label="Habit bearbeiten"
        >
          ✎
        </button>
      </div>
    </div>
  )
}
