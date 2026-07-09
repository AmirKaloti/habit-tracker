// Freundlicher Willkommens-/Leerzustand, wenn noch keine aktiven Habits da sind.

interface OnboardingProps {
  onStart: () => void
}

export function Onboarding({ onStart }: OnboardingProps) {
  return (
    <div className="onboarding">
      <div className="onboarding-icon">◎</div>
      <h2 className="onboarding-title">WILLKOMMEN</h2>
      <p className="onboarding-text">
        Baue neue Gewohnheiten auf, indem du jeden Tag abhakst. Kein Account nötig — deine
        Daten bleiben in diesem Browser.
      </p>
      <ul className="onboarding-tips">
        <li>
          <span className="ob-icon">◯</span> Tippe den Kreis, um einen Tag als erledigt zu
          markieren
        </li>
        <li>
          <span className="ob-icon">📁</span> Ordne Habits in aufklappbare Kategorien
        </li>
        <li>
          <span className="ob-icon">🎯</span> Setze Wochenziele im Bearbeiten-Dialog (✎)
        </li>
        <li>
          <span className="ob-icon">💾</span> Sichere deine Daten per Export auf der
          STATS-Seite
        </li>
      </ul>
      <button className="j-btn onboarding-btn" onClick={onStart}>
        + ERSTEN HABIT ANLEGEN
      </button>
    </div>
  )
}
