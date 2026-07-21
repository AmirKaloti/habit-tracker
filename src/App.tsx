import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/Header'
import type { Tab } from './components/Header'
import { LoginScreen } from './components/LoginScreen'
import { StatsBar } from './components/StatsBar'
import { NewHabitForm } from './components/NewHabitForm'
import { HabitList } from './components/HabitList'
import { CategoryGroup } from './components/CategoryGroup'
import { EditModal } from './components/EditModal'
import { StatsPage } from './components/StatsPage'
import { DraftsPage } from './components/DraftsPage'
import { Onboarding } from './components/Onboarding'
import { CATEGORIES } from './lib/categories'

const SKIP_LOGIN_KEY = 'habitron_skip_login'

function App() {
  const { user, loading: authLoading, cloudEnabled, sendMagicLink, signOut } = useAuth()
  const [skipLogin, setSkipLogin] = useState(
    () => localStorage.getItem(SKIP_LOGIN_KEY) === '1',
  )

  const {
    habits,
    justSynced,
    dismissSyncHint,
    addHabit,
    addDraft,
    activateHabit,
    toggleToday,
    toggleDay,
    toggleYesterday,
    renameHabit,
    setColor,
    setCategory,
    setWeeklyGoal,
    moveHabit,
    removeHabit,
    replaceAll,
  } = useHabits(user?.id)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('active')
  // Auf/Zu-Zustand der Kategorie-Gruppen — bleibt beim Tab-Wechsel erhalten.
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({})

  function handleSkipLogin() {
    localStorage.setItem(SKIP_LOGIN_KEY, '1')
    setSkipLogin(true)
  }

  function handleLoginClick() {
    localStorage.removeItem(SKIP_LOGIN_KEY)
    setSkipLogin(false)
  }

  // Solange Cloud-Sync eingerichtet ist, niemand eingeloggt ist und "Ohne Login
  // weitermachen" nicht gewählt wurde: Login-Bildschirm zeigen. Ohne konfiguriertes
  // Supabase-Projekt (cloudEnabled = false) verhält sich die App wie zuvor.
  if (cloudEnabled && !authLoading && !user && !skipLogin) {
    return <LoginScreen onSendLink={sendMagicLink} onSkip={handleSkipLogin} />
  }

  // Aktive Habits vs. Entwürfe (Drafts) trennen.
  const activeHabits = habits.filter((h) => h.active !== false)
  const draftHabits = habits.filter((h) => h.active === false)

  // Aktive Habits nach Kategorie gruppieren; Habits ohne Kategorie bleiben einzeln.
  // Kategorien werden IMMER gezeigt (auch leer) — sonst gäbe es kein Drop-Ziel,
  // um den ersten Habit per Drag & Drop hineinzuziehen.
  const groups = CATEGORIES.map((cat) => ({
    cat,
    habits: activeHabits.filter((h) => h.category === cat.id),
  }))
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
        cloudEnabled={cloudEnabled}
        userEmail={user?.email}
        onLoginClick={handleLoginClick}
        onLogoutClick={signOut}
      />

      <main className="main">
        {justSynced && (
          <div className="sync-banner">
            <span>☁ Deine lokalen Daten wurden mit deinem Account synchronisiert.</span>
            <button
              className="sync-banner-close"
              onClick={dismissSyncHint}
              aria-label="Hinweis schließen"
            >
              ✕
            </button>
          </div>
        )}

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
                    allActiveHabits={activeHabits}
                    open={!!openCats[g.cat.id]}
                    onOpenChange={(open) =>
                      setOpenCats((prev) => ({ ...prev, [g.cat.id]: open }))
                    }
                    onToggle={toggleToday}
                    onEdit={setEditId}
                    onToggleYesterday={toggleYesterday}
                    onReorder={moveHabit}
                    onAddHabit={(name, category) => addHabit(name, true, category)}
                    onMoveIn={(id) => setCategory(id, g.cat.id)}
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
