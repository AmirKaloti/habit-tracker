import { useState, useRef, useEffect } from 'react'
import type { CSSProperties, DragEvent } from 'react'
import type { Habit } from '../types/habit'
import { todayKey } from '../lib/date'
import { currentStreak } from '../lib/streak'
import { completionRate, weeklyProgress } from '../lib/stats'
import { WeeklyRing } from './WeeklyRing'

interface HabitCardProps {
  habit: Habit
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onMarkYesterday: (id: string) => void
  onReorder: (fromId: string, toId: string) => void
}

export function HabitCard({
  habit,
  onToggle,
  onEdit,
  onMarkYesterday,
  onReorder,
}: HabitCardProps) {
  const done = !!habit.done[todayKey()]
  const streak = currentStreak(habit)
  const color = habit.color ?? '#fb923c'
  const rate = completionRate(habit, 30)
  const pct = Math.round((rate.done / rate.total) * 100)
  const weekDone = weeklyProgress(habit)

  // Kleine Bestätigungs-Animation für den "GESTERN"-Button.
  const [flashYesterday, setFlashYesterday] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Drag & Drop zum Sortieren.
  const [dragOver, setDragOver] = useState(false)

  function handleYesterday() {
    onMarkYesterday(habit.id)
    setFlashYesterday(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setFlashYesterday(false), 800)
  }

  function handleDragStart(e: DragEvent) {
    e.dataTransfer.setData('text/plain', habit.id)
    e.dataTransfer.effectAllowed = 'move'
  }
  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!dragOver) setDragOver(true)
  }
  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const fromId = e.dataTransfer.getData('text/plain')
    if (fromId && fromId !== habit.id) onReorder(fromId, habit.id)
  }

  return (
    <div
      className={`habit-card${done ? ' done' : ''}${dragOver ? ' drag-over' : ''}`}
      style={{ '--habit-color': color } as CSSProperties}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="habit-card-top">
        <span
          className="drag-handle"
          draggable
          onDragStart={handleDragStart}
          title="Zum Sortieren ziehen"
          aria-label="Zum Sortieren ziehen"
        >
          ⠿
        </span>

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

        {habit.weeklyGoal ? (
          <WeeklyRing done={weekDone} goal={habit.weeklyGoal} color={color} />
        ) : null}

        <div className="habit-streak">
          <div className="streak-num">{streak}</div>
          <div className="streak-lbl">STREAK</div>
        </div>

        <button
          className={`yesterday-btn${flashYesterday ? ' flash' : ''}`}
          onClick={handleYesterday}
          title="Hab ich gestern schon gemacht"
        >
          {flashYesterday ? '✓ GESTERN' : 'GESTERN'}
        </button>

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
