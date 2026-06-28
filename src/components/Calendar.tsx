// Monats-Kalender für einen Habit. Zeigt pro Tag: erledigt (grün), verpasst (rot),
// heute (markiert), Zukunft (ausgegraut). Mit Monatsnavigation rückwärts.

import { useState } from 'react'
import type { Habit } from '../types/habit'
import { WEEKDAYS, MONTHS, toKey, todayKey, mondayIndex } from '../lib/date'

interface CalendarProps {
  habit: Habit
}

export function Calendar({ habit }: CalendarProps) {
  // offset = 0 ist der aktuelle Monat, -1 der vorige usw. (Zukunft sperren wir.)
  const [offset, setOffset] = useState(0)

  const now = new Date()
  const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const today = todayKey()
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)

  const firstWeekday = mondayIndex(ref) // Leerzellen vor dem 1. des Monats
  const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate()

  const cells: { key: string; cls: string; label: number }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(ref.getFullYear(), ref.getMonth(), d)
    const key = toKey(cellDate)
    let cls = 'cal-day'
    if (key === today) cls += ' today'
    else if (cellDate > todayMidnight) cls += ' future'
    else if (habit.done[key]) cls += ' done'
    else cls += ' missed'
    cells.push({ key, cls, label: d })
  }

  return (
    <div>
      <div className="cal-header">
        <button
          className="cal-nav"
          onClick={() => setOffset((o) => o - 1)}
          aria-label="Vorheriger Monat"
        >
          ‹
        </button>
        <span className="cal-month">
          {MONTHS[ref.getMonth()]} {ref.getFullYear()}
        </span>
        <button
          className="cal-nav"
          onClick={() => setOffset((o) => Math.min(0, o + 1))}
          disabled={offset >= 0}
          aria-label="Nächster Monat"
        >
          ›
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="cal-day-name">
            {w}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="cal-day empty" />
        ))}
        {cells.map((c) => (
          <div key={c.key} className={c.cls}>
            {c.label}
          </div>
        ))}
      </div>

      <div className="cal-legend">
        <div className="leg-item">
          <div className="leg-dot leg-done" />
          ERLEDIGT
        </div>
        <div className="leg-item">
          <div className="leg-dot leg-miss" />
          VERPASST
        </div>
        <div className="leg-item">
          <div className="leg-dot leg-today" />
          HEUTE
        </div>
      </div>
    </div>
  )
}
