// Kopfzeile: Arc-Reaktor-Logo, heutiges Datum, "New Habit"-Button.

import { WEEKDAYS, mondayIndex } from '../lib/date'

interface HeaderProps {
  onAddClick: () => void
}

function formatToday(): string {
  const now = new Date()
  const day = WEEKDAYS[mondayIndex(now)]
  const date = now.toLocaleDateString('de-DE') // z. B. 25.06.2026
  return `${day} ${date}`
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <>
      <header className="header">
        <div className="logo">
          <div className="arc" />
          <span className="logo-text">HABITRON</span>
        </div>
        <span className="header-date">{formatToday()}</span>
        <button className="btn-add" onClick={onAddClick}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> NEW HABIT
        </button>
      </header>
      <div className="scan-line" />
    </>
  )
}
