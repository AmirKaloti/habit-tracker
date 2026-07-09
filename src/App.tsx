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
import { Onboarding } from './components/Onboarding'
import { CATEGORIES } from './lib/categories'

function App() {
  const {
    habits,
    addHabit,
    addDraft,
    activateHabit,
    toggleToday,
    toggleDay,
    toggleYesterday,
    renameHabit,
    setColor,
    setWeeklyGoal,
    moveHabit,
    removeHabit,
    replaceAll,
  } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('active')
  // Auf/Zu-Zustand der Kategorie-Gruppen — bleibt beim Tab-Wechsel erhalten.
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({})

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
            {activeHabits.length === 0 ? (
              <Onboarding onStart={() => setShowForm(true)} />
            ) : (
              <>
                <div className="section-label">// ACTIVE PROTOCOLS</div>
                {groups.map((g) => (
                  <CategoryGroup
                    key={g.cat.id}
                    category={g.cat}
                    habits={g.habits}
                    open={!!openCats[g.cat.id]}
                    onOpenChange={(open) =>
                      setOpenCats((prev) => ({ ...prev, [g.cat.id]: open }))
                    }
                    onToggle={toggleToday}
                    onEdit={setEditId}
                    onToggleYesterday={toggleYesterday}
                    onReorder={moveHabit}
                    onAddHabit={(name, category) => addHabit(name, true, category)}
                  />
                ))}
                {uncategorized.length > 0 && (
                  <HabitList
                    habits={uncategorized}
                    onToggle={toggleToday}
                    onEdit={setEditId}
                    onToggleYesterday={toggleYesterday}
                    onReorder={moveHabit}
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
          onSetColor={setColor}
          onClose={() => setEditId(null)}
        />
      )}
    </>
  )
}

export default App
