// Bearbeiten-Dialog: Habit umbenennen, Kalender ansehen, Habit löschen.

import { useState } from 'react'
import type { Habit } from '../types/habit'
import { Calendar } from './Calendar'

interface EditModalProps {
  habit: Habit
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}

export function EditModal({ habit, onRename, onRemove, onClose }: EditModalProps) {
  const [name, setName] = useState(habit.name)

  function save() {
    onRename(habit.id, name)
    onClose()
  }

  function remove() {
    if (confirm('Habit wirklich löschen?')) {
      onRemove(habit.id)
      onClose()
    }
  }

  // Klick auf den dunklen Hintergrund schließt das Modal.
  function onOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="overlay" onClick={onOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Habit bearbeiten">
        <div className="modal-title">
          <span>// HABIT CONFIG</span>
          <button className="modal-close" onClick={onClose} aria-label="Schließen">✕</button>
        </div>

        <div className="field">
          <div className="field-lbl">DESIGNATION</div>
          <input
            className="j-input"
            style={{ width: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
        </div>

        <div className="divider" />

        <Calendar habit={habit} />

        <div className="btn-row">
          <button className="j-btn" onClick={save}>SAVE CHANGES</button>
          <button className="j-btn j-btn-danger" onClick={remove}>DELETE</button>
        </div>
      </div>
    </div>
  )
}
