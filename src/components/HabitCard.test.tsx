import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitCard } from './HabitCard'
import { toKey } from '../lib/date'
import type { Habit } from '../types/habit'

const habit: Habit = { id: 'h1', name: 'SPORT', done: {} }

function yesterdayHabit(): Habit {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return { id: 'h1', name: 'SPORT', done: { [toKey(d)]: true } }
}

describe('HabitCard', () => {
  it('zeigt den Namen und den Status "ausstehend" an', () => {
    render(
      <HabitCard
        habit={habit}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onToggleYesterday={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    expect(screen.getByText('SPORT')).toBeInTheDocument()
    expect(screen.getByText(/AUSSTEHEND/)).toBeInTheDocument()
  })

  it('ruft onToggle mit der Habit-id auf, wenn der Check-Button geklickt wird', async () => {
    const onToggle = vi.fn()
    render(
      <HabitCard
        habit={habit}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onToggleYesterday={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByLabelText('Als erledigt markieren'))

    expect(onToggle).toHaveBeenCalledWith('h1')
  })

  it('ruft onEdit auf, wenn der Bearbeiten-Button geklickt wird', async () => {
    const onEdit = vi.fn()
    render(
      <HabitCard
        habit={habit}
        onToggle={vi.fn()}
        onEdit={onEdit}
        onToggleYesterday={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByLabelText('Habit bearbeiten'))

    expect(onEdit).toHaveBeenCalledWith('h1')
  })

  it('ruft onToggleYesterday auf, wenn der "GESTERN"-Button geklickt wird', async () => {
    const onToggleYesterday = vi.fn()
    render(
      <HabitCard
        habit={habit}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onToggleYesterday={onToggleYesterday}
        onReorder={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByText('GESTERN'))

    expect(onToggleYesterday).toHaveBeenCalledWith('h1')
  })

  describe('wenn gestern schon erledigt', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 5, 25, 12, 0, 0))
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('zeigt den GESTERN-Button im erledigten Zustand (grün, mit Haken)', () => {
      render(
        <HabitCard
          habit={yesterdayHabit()}
          onToggle={vi.fn()}
          onEdit={vi.fn()}
          onToggleYesterday={vi.fn()}
          onReorder={vi.fn()}
        />,
      )
      const btn = screen.getByText('✓ GESTERN')
      expect(btn).toBeInTheDocument()
      expect(btn.className).toContain('done')
    })
  })
})
