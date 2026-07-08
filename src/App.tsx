import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { Header } from './components/Header'
import type { Tab } from './components/Header'
import { StatsBar } from './components/StatsBar'
import { NewHabitForm } from './components/NewHabitForm'
import { HabitList } from './components/HabitList'
import { CategoryGroup } from './components/CategoryGroup'
import { EditModal } from './components/EditModal'
import { StatsPage } from './components/StatsPage'
import { DraftsPage } from './components/DraftsPage'
import { CATEGORIES } from './lib/categories'

function App() {
  const {
    habits,
    addHabit,
    addDraft,
    activateHabit,
    toggleToday,
    toggleDay,
    markYesterday,
    renameHabit,
    setWeeklyGoal,
    removeHabit,
    replaceAll,
  } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('active')

  // Aktive Habits vs. Entwürfe (Drafts) trennen.
  const activeHabits = habits.filter((h) => h.active !== false)
  const draftHabits = habits.filter((h) => h.active === false)

  // Aktive Habits nach Kategorie gruppieren; Habits ohne Kategorie bleiben einzeln.
  const groups = CATEGORIES.map((cat) => ({
    cat,
    habits: activeHabits.filter((h) => h.category === cat.id),
  })).filter((g) => g.habits.length > 0)
  const uncategorized = activeHabits.filter((h) => !h.category)

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
              <NewHabitForm
                onAdd={(name, category) => addHabit(name, true, category)}
                onClose={() => setShowForm(false)}
              />
            )}
            <div className="section-label">// ACTIVE PROTOCOLS</div>

            {activeHabits.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <div className="empty-text">
                  KEINE HABITS — KLICKE "NEW HABIT" ZUM STARTEN
                </div>
              </div>
            ) : (
              <>
                {groups.map((g) => (
                  <CategoryGroup
                    key={g.cat.id}
                    category={g.cat}
                    habits={g.habits}
                    onToggle={toggleToday}
                    onEdit={setEditId}
                    onMarkYesterday={markYesterday}
                  />
                ))}
                {uncategorized.length > 0 && (
                  <HabitList
                    habits={uncategorized}
                    onToggle={toggleToday}
                    onEdit={setEditId}
                    onMarkYesterday={markYesterday}
                  />
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <StatsPage habits={activeHabits} allHabits={habits} onImport={replaceAll} />
        )}

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
          onSetWeeklyGoal={setWeeklyGoal}
          onClose={() => setEditId(null)}
        />
      )}
    </>
  )
}

export default App
