// Schnellübersicht der letzten 7 Tage für einen Habit (Stats-Seite).
// Zeigt pro Tag ein Kästchen (erledigt = farbig mit Haken), heute markiert.
// So sieht man auf einen Blick, ob z. B. gestern erledigt wurde.

import type { Habit } from '../types/habit'
import { toKey, mondayIndex, WEEKDAYS } from '../lib/date'

interface RecentDaysProps {
  habit: Habit
}

export function RecentDays({ habit }: RecentDaysProps) {
  const color = habit.color ?? '#fb923c'
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cells = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = toKey(d)
    cells.push({
      key,
      label: WEEKDAYS[mondayIndex(d)],
      num: d.getDate(),
      done: !!habit.done[key],
      isToday: i === 0,
    })
  }

  return (
    <div className="recent-days">
      {cells.map((c) => (
        <div key={c.key} className="rd-cell">
          <div className="rd-lbl">{c.label}</div>
          <div
            className={`rd-box${c.done ? ' done' : ''}${c.isToday ? ' today' : ''}`}
            style={
              c.done ? { background: color, boxShadow: `0 0 6px ${color}88` } : undefined
            }
            title={c.key}
          >
            {c.done ? '✓' : ''}
          </div>
          <div className="rd-num">{c.num}</div>
        </div>
      ))}
    </div>
  )
}
