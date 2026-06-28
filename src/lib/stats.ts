import type { Habit } from '../types/habit'

export interface MonthStat {
  label: string
  completions: number
}

export function completionsPerMonth(habits: Habit[]): MonthStat[] {
  const MONTHS = [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
  ]
  const now = new Date()
  const result: MonthStat[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    let count = 0
    for (const habit of habits) {
      for (const key of Object.keys(habit.done)) {
        if (key.startsWith(prefix)) count++
      }
    }
    result.push({ label: MONTHS[d.getMonth()], completions: count })
  }
  return result
}

export function totalCompletions(habits: Habit[]): number {
  return habits.reduce((sum, h) => sum + Object.keys(h.done).length, 0)
}
