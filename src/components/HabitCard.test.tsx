import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitCard } from './HabitCard'
import type { Habit } from '../types/habit'

const habit: Habit = { id: 'h1', name: 'SPORT', done: {} }

describe('HabitCard', () => {
  it('zeigt den Namen und den Status "ausstehend" an', () => {
    render(
      <HabitCard
        habit={habit}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onMarkYesterday={vi.fn()}
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
        onMarkYesterday={vi.fn()}
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
        onMarkYesterday={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByLabelText('Habit bearbeiten'))

    expect(onEdit).toHaveBeenCalledWith('h1')
  })

  it('ruft onMarkYesterday auf, wenn der "GESTERN"-Button geklickt wird', async () => {
    const onMarkYesterday = vi.fn()
    render(
      <HabitCard
        habit={habit}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onMarkYesterday={onMarkYesterday}
        onReorder={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByText('GESTERN'))

    expect(onMarkYesterday).toHaveBeenCalledWith('h1')
  })
})
