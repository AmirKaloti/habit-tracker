import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { Header } from './components/Header'
import type { Tab } from './components/Header'
import { StatsBar } from './components/StatsBar'
import { NewHabitForm } from './components/NewHabitForm'
import { HabitList } from './components/HabitList'
import { EditModal } from './components/EditModal'
import { StatsPage } from './components/StatsPage'
import { DraftsPage } from './components/DraftsPage'

function App() {
  const {
    habits,
    addHabit,
    addDraft,
    activateHabit,
    toggleToday,
    toggleDay,
    renameHabit,
    removeHabit,
  } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('active')

  // Aktive Habits vs. Entwürfe (Drafts) trennen.
  const activeHabits = habits.filter((h) => h.active !== false)
  const draftHabits = habits.filter((h) => h.active === false)

  const editingHabit = habits.find((h) => h.id === editId) ?? null

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab !== 'active') setShowForm(false)
  }

  return (
    <>
      <Header
        onAddClick={() => setShowForm((v) => !v)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="main">
        {activeTab === 'active' && (
          <>
            <StatsBar habits={activeHabits} />
            {showForm && (
              <NewHabitForm onAdd={addHabit} onClose={() => setShowForm(false)} />
            )}
            <div className="section-label">// ACTIVE PROTOCOLS</div>
            <HabitList habits={activeHabits} onToggle={toggleToday} onEdit={setEditId} />
          </>
        )}

        {activeTab === 'stats' && <StatsPage habits={activeHabits} />}

        {activeTab === 'drafts' && (
          <DraftsPage
            drafts={draftHabits}
            onAdd={addDraft}
            onActivate={activateHabit}
            onRemove={removeHabit}
          />
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
