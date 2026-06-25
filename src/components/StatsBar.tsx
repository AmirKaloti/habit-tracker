// Statistik-Leiste: Anzahl Habits, heute erledigt, längste Streak.

import type { Habit } from '../types/habit'
import { todayKey } from '../lib/date'
import { bestStreak } from '../lib/streak'

interface StatsBarProps {
  habits: Habit[]
}

export function StatsBar({ habits }: StatsBarProps) {
  const today = todayKey()
  const doneToday = habits.filter((h) => h.done[today]).length

  return (
    <div className="stats-row">
      <Stat value={habits.length} label="HABITS" />
      <Stat value={doneToday} label="HEUTE ERLEDIGT" />
      <Stat value={bestStreak(habits)} label="BEST STREAK" />
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-num">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  )
}
