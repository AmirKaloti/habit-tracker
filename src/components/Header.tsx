import { WEEKDAYS, mondayIndex } from '../lib/date'

export type Tab = 'active' | 'stats' | 'drafts'

interface HeaderProps {
  onAddClick: () => void
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  // Cloud-Sync-Status — cloudEnabled ist false, solange kein Supabase-Projekt
  // eingerichtet ist (dann wird hier gar nichts Auth-bezogenes angezeigt).
  cloudEnabled: boolean
  userEmail?: string | null
  onLoginClick?: () => void
  onLogoutClick?: () => void
}

function formatToday(): string {
  const now = new Date()
  const day = WEEKDAYS[mondayIndex(now)]
  const date = now.toLocaleDateString('de-DE')
  return `${day} ${date}`
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'active', label: 'ACTIVE' },
  { id: 'stats', label: 'STATS' },
  { id: 'drafts', label: 'DRAFTS' },
]

export function Header({
  onAddClick,
  activeTab,
  onTabChange,
  cloudEnabled,
  userEmail,
  onLoginClick,
  onLogoutClick,
}: HeaderProps) {
  return (
    <>
      <header className="header">
        <div className="logo">
          <div className="arc" />
          <span className="logo-text">MASTER YOUR HABIT</span>
        </div>

        <div className="tab-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="header-right">
          {cloudEnabled &&
            (userEmail ? (
              <div className="auth-badge">
                <span className="auth-email">{userEmail}</span>
                <button
                  className="auth-logout"
                  onClick={onLogoutClick}
                  title="Ausloggen"
                  aria-label="Ausloggen"
                >
                  ⏻
                </button>
              </div>
            ) : (
              <button className="auth-login-link" onClick={onLoginClick}>
                LOGIN
              </button>
            ))}

          <span className="header-date">{formatToday()}</span>
          {activeTab === 'active' && (
            <button className="btn-add" onClick={onAddClick}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              <span className="btn-add-label"> NEW HABIT</span>
            </button>
          )}
        </div>
      </header>
      <div className="scan-line" />
    </>
  )
}
