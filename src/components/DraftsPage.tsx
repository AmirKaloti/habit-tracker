import { useState } from 'react'
import type { Habit } from '../types/habit'

interface DraftsPageProps {
  drafts: Habit[]
  onAdd: (name: string) => void
  onActivate: (id: string) => void
  onRemove: (id: string) => void
}

export function DraftsPage({ drafts, onAdd, onActivate, onRemove }: DraftsPageProps) {
  const [name, setName] = useState('')

  function submit() {
    const clean = name.trim()
    if (!clean) return
    onAdd(clean)
    setName('')
  }

  return (
    <div className="drafts-page">
      <p className="drafts-intro">
        // IDEEN-SPEICHER — Habits, die du später angehen willst. Erst wenn du dich bereit
        fühlst, aktivierst du sie und sie wandern zu „ACTIVE".
      </p>

      <div className="new-form">
        <div className="new-form-title">// NEUE IDEE</div>
        <div className="new-form-row">
          <input
            className="j-input"
            style={{ flex: 1 }}
            placeholder="z. B. MEDITIEREN, FRÜH AUFSTEHEN…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <button className="j-btn" onClick={submit}>
            SPEICHERN
          </button>
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◇</div>
          <div className="empty-text">// NOCH KEINE IDEEN GESPEICHERT</div>
        </div>
      ) : (
        <div className="drafts-list">
          {drafts.map((draft) => (
            <div key={draft.id} className="draft-card">
              <span
                className="draft-dot"
                style={{ background: draft.color ?? '#fb923c' }}
              />
              <span className="draft-name">{draft.name}</span>
              <button
                className="j-btn draft-activate"
                onClick={() => onActivate(draft.id)}
              >
                AKTIVIEREN →
              </button>
              <button
                className="edit-btn"
                onClick={() => onRemove(draft.id)}
                aria-label="Idee löschen"
                title="Idee löschen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
