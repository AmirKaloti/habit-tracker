import { WEEKDAYS, mondayIndex } from '../lib/date'

type Tab = 'habits' | 'stats'

interface HeaderProps {
  onAddClick: () => void
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

function formatToday(): string {
  const now = new Date()
  const day = WEEKDAYS[mondayIndex(now)]
  const date = now.toLocaleDateString('de-DE')
  return `${day} ${date}`
}

export function Header({ onAddClick, activeTab, onTabChange }: HeaderProps) {
  return (
    <>
      <header className="header">
        <div className="logo">
          <div className="arc" />
          <span className="logo-text">HABITRON</span>
        </div>

        <div className="tab-nav">
          <button
            className={`tab-btn${activeTab === 'habits' ? ' active' : ''}`}
            onClick={() => onTabChange('habits')}
          >
            HABITS
          </button>
          <button
            className={`tab-btn${activeTab === 'stats' ? ' active' : ''}`}
            onClick={() => onTabChange('stats')}
          >
            STATS
          </button>
        </div>

        <div className="header-right">
          <span className="header-date">{formatToday()}</span>
          {activeTab === 'habits' && (
            <button className="btn-add" onClick={onAddClick}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> NEW HABIT
            </button>
          )}
        </div>
      </header>
      <div className="scan-line" />
    </>
  )
}
