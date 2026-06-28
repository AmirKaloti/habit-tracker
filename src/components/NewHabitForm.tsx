// Eingabeformular für einen neuen Habit. Wird über den Header ein-/ausgeklappt.

import { useState } from 'react'

interface NewHabitFormProps {
  onAdd: (name: string) => void
  onClose: () => void
}

export function NewHabitForm({ onAdd, onClose }: NewHabitFormProps) {
  const [name, setName] = useState('')

  function submit() {
    if (!name.trim()) return
    onAdd(name)
    setName('')
    onClose()
  }

  return (
    <div className="new-form">
      <div className="new-form-title">// NEW HABIT</div>
      <div className="new-form-row">
        <input
          className="j-input"
          style={{ flex: 1 }}
          placeholder="HABIT NAME..."
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') onClose()
          }}
        />
        <button className="j-btn" onClick={submit}>
          ADD
        </button>
        <button className="j-btn j-btn-ghost" onClick={onClose}>
          CANCEL
        </button>
      </div>
    </div>
  )
}
