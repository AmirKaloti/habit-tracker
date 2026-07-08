import { describe, it, expect, beforeEach } from 'vitest'
import { loadHabits, saveHabits } from './storage'
import type { Habit } from '../types/habit'

const KEY = 'habitron_v1'
const BACKUP = 'habitron_v1_backup'

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('speichert und lädt Habits unverändert (round-trip)', () => {
    const habits: Habit[] = [{ id: '1', name: 'LESEN', done: { '2026-06-25': true } }]
    saveHabits(habits)
    expect(loadHabits()).toEqual(habits)
  })

  it('liefert ein leeres Array, wenn nichts gespeichert ist', () => {
    expect(loadHabits()).toEqual([])
  })

  it('liefert ein leeres Array bei beschädigten Daten (ohne Backup)', () => {
    localStorage.setItem(KEY, 'kein-gültiges-json{{{')
    expect(loadHabits()).toEqual([])
  })
})

describe('storage Sicherheitsnetz', () => {
  const habits: Habit[] = [
    { id: 'a', name: 'SPORT', done: {} },
    { id: 'b', name: 'IDEE', done: {}, active: false }, // ein Draft
  ]

  it('legt vor dem Überschreiben eine Zweitkopie an', () => {
    saveHabits(habits)
    saveHabits([]) // versehentliches Leeren
    expect(JSON.parse(localStorage.getItem(BACKUP)!)).toEqual(habits)
  })

  it('stellt aus der Zweitkopie wieder her, wenn der Hauptspeicher kaputt ist', () => {
    saveHabits(habits)
    saveHabits([{ id: 'c', name: 'NEU', done: {} }]) // Backup = habits (inkl. Draft)
    localStorage.setItem(KEY, '{kaputt') // Hauptspeicher zerstören
    expect(loadHabits()).toEqual(habits)
  })

  it('respektiert ein bewusst leeres Array (keine ungewollte Wiederherstellung)', () => {
    localStorage.setItem(KEY, '[]')
    localStorage.setItem(BACKUP, JSON.stringify(habits))
    expect(loadHabits()).toEqual([])
  })
})
