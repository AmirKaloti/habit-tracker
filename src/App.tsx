// Wurzelkomponente: holt den State aus useHabits und verteilt ihn an die UI-Komponenten.
// Hält nur eine eigene UI-Entscheidung: welcher Habit gerade bearbeitet wird / ob das Formular offen ist.

import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { Header } from './components/Header'
import { StatsBar } from './components/StatsBar'
import { NewHabitForm } from './components/NewHabitForm'
import { HabitList } from './components/HabitList'
import { EditModal } from './components/EditModal'

function App() {
  const { habits, addHabit, toggleToday, renameHabit, removeHabit } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const editingHabit = habits.find((h) => h.id === editId) ?? null

  return (
    <>
      <Header onAddClick={() => setShowForm((v) => !v)} />

      <main className="main">
        <StatsBar habits={habits} />

        {showForm && (
          <NewHabitForm onAdd={addHabit} onClose={() => setShowForm(false)} />
        )}

        <div className="section-label">// ACTIVE PROTOCOLS</div>

        <HabitList habits={habits} onToggle={toggleToday} onEdit={setEditId} />
      </main>

      {editingHabit && (
        <EditModal
          habit={editingHabit}
          onRename={renameHabit}
          onRemove={removeHabit}
          onClose={() => setEditId(null)}
        />
      )}
    </>
  )
}

export default App
