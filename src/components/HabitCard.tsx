import type { CSSProperties } from 'react'
import type { Habit } from '../types/habit'
import { todayKey } from '../lib/date'
import { currentStreak } from '../lib/streak'
import { completionRate } from '../lib/stats'
import { HabitHeatmap } from './HabitHeatmap'

interface HabitCardProps {
  habit: Habit
  onToggle: (id: string) => void
  onEdit: (id: string) => void
}

function encouragement(pct: number): string {
  if (pct >= 90) return 'STARK!'
  if (pct >= 70) return 'WEITER SO'
  if (pct >= 40) return 'DRANBLEIBEN'
  if (pct > 0) return 'GUTER START'
  return 'LEG LOS'
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
          <div className="habit-sub">{done ? '✓ HEUTE ERLEDIGT' : '— AUSSTEHEND'}</div>
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

      <HabitHeatmap habit={habit} />

      <div className="habit-rate">
        <span className="rate-num" style={{ color }}>
          {rate.done}/{rate.total}
        </span>
        <span className="rate-text">
          {' '}
          in den letzten {rate.total} Tagen · {pct}% ·{' '}
        </span>
        <span className="rate-msg" style={{ color }}>
          {encouragement(pct)}
        </span>
      </div>
    </div>
  )
}
