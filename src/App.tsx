import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { Header } from './components/Header'
import { StatsBar } from './components/StatsBar'
import { NewHabitForm } from './components/NewHabitForm'
import { HabitList } from './components/HabitList'
import { EditModal } from './components/EditModal'
import { StatsPage } from './components/StatsPage'

type Tab = 'habits' | 'stats'

function App() {
  const { habits, addHabit, toggleToday, toggleDay, renameHabit, removeHabit } =
    useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('habits')

  const editingHabit = habits.find((h) => h.id === editId) ?? null

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab === 'stats') setShowForm(false)
  }

  return (
    <>
      <Header
        onAddClick={() => setShowForm((v) => !v)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="main">
        {activeTab === 'habits' ? (
          <>
            <StatsBar habits={habits} />
            {showForm && (
              <NewHabitForm onAdd={addHabit} onClose={() => setShowForm(false)} />
            )}
            <div className="section-label">// ACTIVE PROTOCOLS</div>
            <HabitList habits={habits} onToggle={toggleToday} onEdit={setEditId} />
          </>
        ) : (
          <StatsPage habits={habits} />
        )}
      </main>

      {editingHabit && (
        <EditModal
          habit={editingHabit}
          onRename={renameHabit}
          onRemove={removeHabit}
          onToggleDay={toggleDay}
          onClose={() => setEditId(null)}
        />
      )}
    </>
  )
}

export default App
