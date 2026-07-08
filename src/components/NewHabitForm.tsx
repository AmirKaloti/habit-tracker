// Eingabeformular für einen neuen Habit. Wird über den Header ein-/ausgeklappt.

import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'

interface NewHabitFormProps {
  onAdd: (name: string, category?: string) => void
  onClose: () => void
}

export function NewHabitForm({ onAdd, onClose }: NewHabitFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')

  function submit() {
    if (!name.trim()) return
    onAdd(name, category || undefined)
    setName('')
    setCategory('')
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
        <select
          className="j-input j-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Kategorie"
        >
          <option value="">KEINE KATEGORIE</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toUpperCase()}
            </option>
          ))}
        </select>
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
