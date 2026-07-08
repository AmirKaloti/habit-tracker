// Export/Import der Daten als JSON-Datei. Der "dauerhafte Sicherung"-Bereich.
// Export lädt eine Datei herunter; Import liest eine Datei und ersetzt die Daten.

import { useRef, useState } from 'react'
import type { Habit } from '../types/habit'
import { habitsToJson, habitsFromJson } from '../lib/backup'

interface DataBackupProps {
  habits: Habit[]
  onImport: (habits: Habit[]) => void
}

export function DataBackup({ habits, onImport }: DataBackupProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string>('')

  function exportData() {
    const json = habitsToJson(habits, new Date().toISOString())
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `master-your-habit-backup-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg(`✓ ${habits.length} Habits exportiert`)
  }

  function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = habitsFromJson(String(reader.result))
        if (
          confirm(
            `${imported.length} Habits aus der Datei importieren?\n\n` +
              `ACHTUNG: Das ersetzt deine aktuellen ${habits.length} Habits.`,
          )
        ) {
          onImport(imported)
          setMsg(`✓ ${imported.length} Habits importiert`)
        }
      } catch (err) {
        setMsg(`✕ Fehler: ${err instanceof Error ? err.message : 'Datei unlesbar'}`)
      }
    }
    reader.readAsText(file)
    // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann.
    e.target.value = ''
  }

  return (
    <div className="backup-card">
      <div className="chart-title">// DATEN SICHERN</div>
      <p className="backup-hint">
        Speichere deine Habits als Datei (Backup) oder lade ein Backup zurück. Empfohlen
        ab und zu — die Daten liegen sonst nur in diesem Browser.
      </p>
      <div className="backup-row">
        <button className="j-btn" onClick={exportData}>
          ↓ EXPORT
        </button>
        <button className="j-btn j-btn-ghost" onClick={() => fileInput.current?.click()}>
          ↑ IMPORT
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={onFilePicked}
        />
      </div>
      {msg && <div className="backup-msg">{msg}</div>}
    </div>
  )
}
