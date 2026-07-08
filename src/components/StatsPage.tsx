import { useMemo } from 'react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Habit } from '../types/habit'
import { completionsPerMonth, totalCompletions } from '../lib/stats'
import { currentStreak, bestStreak } from '../lib/streak'
import { HabitHeatmap } from './HabitHeatmap'
import { DataBackup } from './DataBackup'

interface Props {
  habits: Habit[]
  allHabits: Habit[]
  onImport: (habits: Habit[]) => void
}

export function StatsPage({ habits, allHabits, onImport }: Props) {
  const chartData = useMemo(() => completionsPerMonth(habits), [habits])
  const total = useMemo(() => totalCompletions(habits), [habits])
  const best = bestStreak(habits)
  const todayStreaks = habits.reduce((sum, h) => sum + (currentStreak(h) > 0 ? 1 : 0), 0)

  return (
    <div className="stats-page">
      <div className="sp-grid">
        <BigStat value={total} label="COMPLETIONS GESAMT" />
        <BigStat value={best} label="BEST STREAK" />
        <BigStat value={todayStreaks} label="AKTIVE STREAKS" />
      </div>

      <div className="chart-card">
        <div className="chart-title">// COMPLETIONS PRO MONAT</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="orange-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: '#6b4a2a', fontSize: 10, fontFamily: 'Courier New' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#1f1f1f',
                border: '1px solid rgba(251,146,60,0.3)',
                borderRadius: 6,
                fontFamily: 'Courier New',
              }}
              labelStyle={{ color: '#fb923c', fontSize: 11, letterSpacing: 1 }}
              itemStyle={{ color: '#f5f0ea', fontSize: 11 }}
              formatter={(v) => [v, 'Completions']}
            />
            <Area
              type="monotone"
              dataKey="completions"
              stroke="#fb923c"
              strokeWidth={2}
              fill="url(#orange-grad)"
              dot={false}
              activeDot={{ r: 4, fill: '#fb923c', stroke: '#0d0d0d', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {habits.length > 0 && (
        <div className="heatmap-section">
          <div className="chart-title">// AKTIVITÄT — LETZTE 52 WOCHEN</div>
          {habits.map((habit) => {
            const rate = Object.keys(habit.done).length
            return (
              <div key={habit.id} className="heatmap-block">
                <div className="heatmap-block-head">
                  <span
                    className="table-color-dot"
                    style={{ background: habit.color ?? '#fb923c' }}
                  />
                  <span className="heatmap-block-name">{habit.name}</span>
                  <span className="heatmap-block-total">{rate}× erledigt</span>
                </div>
                <HabitHeatmap habit={habit} />
              </div>
            )
          })}
        </div>
      )}

      {habits.length > 0 && (
        <div className="habits-table">
          <div className="table-header">
            <span>HABIT</span>
            <span>STREAK</span>
            <span>GESAMT</span>
          </div>
          {habits.map((habit) => {
            const streak = currentStreak(habit)
            const completions = Object.keys(habit.done).length
            return (
              <div key={habit.id} className="table-row">
                <div className="table-habit-name">
                  <span
                    className="table-color-dot"
                    style={{ background: habit.color ?? '#fb923c' }}
                  />
                  {habit.name}
                </div>
                <span className="table-streak">{streak}</span>
                <span className="table-completions">{completions}</span>
              </div>
            )
          })}
        </div>
      )}

      {habits.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <div className="empty-text">// KEINE DATEN — ERST HABITS ANLEGEN</div>
        </div>
      )}

      <DataBackup habits={allHabits} onImport={onImport} />
    </div>
  )
}

function BigStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat-card-big">
      <div className="stat-num-big">{value}</div>
      <div className="stat-lbl-small">{label}</div>
    </div>
  )
}
