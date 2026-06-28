import type { Habit } from '../types/habit'
import { toKey, mondayIndex } from '../lib/date'

interface Props {
  habit: Habit
}

interface Cell {
  key: string
  status: 'done' | 'empty' | 'future'
}

function buildGrid(habit: Habit): Cell[][] {
  // Returns rows[dayOfWeek 0-6][weekIndex 0-51]
  // Row-first order so CSS grid-template-columns works naturally
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dow = mondayIndex(today)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - dow)

  const start = new Date(weekStart)
  start.setDate(weekStart.getDate() - 51 * 7)

  const rows: Cell[][] = Array.from({ length: 7 }, () => [])

  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const key = toKey(date)
      let status: 'done' | 'empty' | 'future'
      if (date > today) status = 'future'
      else if (habit.done[key]) status = 'done'
      else status = 'empty'
      rows[d].push({ key, status })
    }
  }
  return rows
}

export function HabitHeatmap({ habit }: Props) {
  const rows = buildGrid(habit)
  const color = habit.color ?? '#fb923c'

  return (
    <div className="heatmap">
      {rows.flat().map((cell, i) => (
        <div
          key={i}
          className={`heatmap-cell ${cell.status}`}
          style={
            cell.status === 'done'
              ? { background: color, boxShadow: `0 0 4px ${color}99` }
              : undefined
          }
          title={cell.key}
        />
      ))}
    </div>
  )
}
